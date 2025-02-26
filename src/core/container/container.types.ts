/**
 * InversifyJS need to use the type as identifiers at runtime.
 * We use symbols as identifiers but you can also use classes and or string literals.
 */
export default {
  UserService: Symbol('UserService'),
  UserController: Symbol('UserController'),
  UserRepository: Symbol('UserRepository'),
  OtpService: Symbol('OtpService'),
  OtpController: Symbol('OtpController'),
  OtpRepository: Symbol('OtpRepository'),

  // external
  NotificationService: Symbol('NotificationService'),
  TokenService: Symbol('TokenService'),
  ProfileService: Symbol('ProfileService'),
  PaymentService: Symbol('PaymentService'),

  // kafka
  KafkaProducer: Symbol('KafkaProducer'),
  KafkaConsumer: Symbol('KafkaConsumer'),
  EventController: Symbol('EventController'),
  EventService: Symbol('EventService'),
};
