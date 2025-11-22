export type ReviewRequest = {
  taskId: number,
  revieweeUsername: string,
  rating: number,
  comment: string
}

export type CreateReviewProps = {
  taskId: number,
  revieweeUsername: string,
  submitRoute: string,
  cancelRoute: string,
}