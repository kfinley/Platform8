using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Text.Json;

using Microsoft.Extensions.Options;

using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;

using MediatR;

using Platform8.User.Models;

namespace Platform8.User.Commands
{
  public class SendRegistrationConfirmationHandler : INotificationHandler<SendRegistrationConfirmationRequest>
  {
    private readonly ContactOptions contactOptions;
    private readonly SiteOptions siteOptions;
    private readonly IAmazonSimpleEmailService emailService;
    public SendRegistrationConfirmationHandler(IOptions<SiteOptions> siteOptions, IOptions<ContactOptions> contactOptions, IAmazonSimpleEmailService emailService)
    {
      this.contactOptions = contactOptions.Value;
      this.siteOptions = siteOptions.Value;
      this.emailService = emailService;
    }

    private static string GenerateUrl(string baseUri, string userId, string password) =>
            $"{baseUri}#/login?regCode={userId}{Uri.EscapeDataString("|" + password)}";

    public async Task Handle(SendRegistrationConfirmationRequest request, CancellationToken cancellationToken)
    {

      var templateData = new Dictionary<string, object>
      {
          {"FirstName", request.FirstName},
          {"Url", GenerateUrl(this.siteOptions.Url, request.UserId.ToString(), request.TempPassword)}
      };

      var emailRequest = new SendTemplatedEmailRequest
      {
        Source = this.contactOptions.SenderEmail,
        Template = EmailTEmplates.ConfirmRegistration.ToString(),
        Destination = new Destination
        {
          ToAddresses = new List<string> { request.Email }
        },
        TemplateData = JsonSerializer.Serialize(templateData)
      };

      var result = await this.emailService.SendTemplatedEmailAsync(emailRequest);

      if (!result.IsSuccess())
      {
        throw new Exception("Failed to send registration confirmation message.");
      }
    }
  }
}
