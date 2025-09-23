export enum PaymentOption {
  FULL_PAYMENT = 'Full Payment',
  INSTALLMENTS = 'Installments'
}

export enum Status {
    PENDING = 'Pending',
    COMPLETED = 'Completed',
    FAILED = 'Failed',
    SUCCEEDED = 'Succeeded'
}

export enum InstallmentStatus{
    ACTIVE = 'Active',
    COMPLETED = 'Completed',
    DEFAULTED = 'Defaulted',
    EXTENDED = 'Extended',
    PENDING = 'Pending',
    DEFAULTED_GRACE_PERIOD = 'Defaulted - Grace Period'
}
