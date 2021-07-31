using System;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;
using MediatR;

namespace Platform8.Aws.Commands
{
  public class PublishMessageRequest : INotification
  {
    public string Subject { get; set; }
    public string Topic { get; set; }
    public string Message { get; set; }
  }

  public class PublishMessageHandler : INotificationHandler<PublishMessageRequest>
  {
    private readonly IAmazonSimpleNotificationService snsService;
    private readonly ILogger<PublishMessageHandler> logger;
    public PublishMessageHandler(IAmazonSimpleNotificationService snsService, ILogger<PublishMessageHandler> logger)
    {
      this.snsService = snsService;
      this.logger = logger;
    }

    public async Task Handle(PublishMessageRequest request, CancellationToken cancellationToken)
    {
      var publishRequest = new PublishRequest
      {
        Subject = request.Subject,
        TargetArn = $"arn:aws:sns:us-west-1:101010101010:{request.Topic}", //TODO: Fix this...
        Message = request.Message
      };

      var result = await this.snsService.PublishAsync(publishRequest);

      this.logger.LogInformation($"Published TopicArn/MessageId: {publishRequest.TopicArn}/{result.MessageId}");      
    }
  }
}
