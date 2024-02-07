export interface IOrderEmailMessageContent {
  receiverEmail: string;
  username: string;
  template: string;
  sender: string;
  offerLink: string;
  amount: string;
  buyerUsername: string;
  sellerUsername: string;
  title: string;
  description: string;
  deliveryDays: string;
  orderId: string;
  orderDue: string;
  requirements: string;
  orderUrl: string;
  originalDate: string;
  newDate: string;
  reason: string;
  subject: string;
  header: string;
  type: string;
  message: string;
  serviceFee: string;
  total: string;
}

export interface IAuthEmailMessageContent {
  receiverEmail: string;
  username: string;
  template: string;
  verifyLink: string;
  resetLink: string;
}
