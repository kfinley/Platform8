export const messages = {
  Transactions: {
    Upload: {
      Success: {
        header: "Transactions processing...",
        message: "The transactions file has been uploaded and is being processed."
      }
    },
    Processed: {
      Success: {
        header: "Transactions processed!",
        message: (params: { count: number, saved: number }) => {
          if (params.saved == 0) {
            return `${params.count} were processed but none were new.`
          }
          if (params.count === params.saved) {
            return `${params.saved} transactions saved and are ready for review.`;
          }
          return `${params.count} transactions processed. ${params.saved} were new and have been saved.`
        }
      }
    }
  }
}
