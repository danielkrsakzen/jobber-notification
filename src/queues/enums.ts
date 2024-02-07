export enum ConnectionExchange {
  AUTH_EXCHANGE = 'jobber-email-notification',
  ORDER_EXCHANGE = 'jobber-order-notification'
}

export enum ConnectionRoutingKey {
  AUTH_ROUTING_KEY = 'auth-email',
  ORDER_ROUTING_KEY = 'order-email'
}

export enum ConnectionQueueName {
  AUTH_QUEUE_NAME = 'auth-email-queue',
  ORDER_QUEUE_NAME = 'order-email-queue'
}

export enum CommunicationType {
  DIRECT = 'direct'
}

export enum EmailTemplate {
  ORDER_PLACED = 'orderPlaced',
  ORDER_RECEIPT = 'orderReceipt'
}
