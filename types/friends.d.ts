export interface IFriend {
  level: string
  referal: IReferral
}

export interface IReferral {
  level: number,
  full_name: string,
  invited_count: number,
  purchased_trading_systems: number,
  sub_referrals: IReferral[],
  username?: string
}
