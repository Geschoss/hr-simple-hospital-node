// TODO придумать что то, что бы не писать мильен раз типы
declare type PatientDomain = {
  list: () => Promise<Patient[]>;
  delete: (id: number) => Promise<void>;
  create(patient: Patient): Promise<void>;
  search: (name: string) => Promise<Patient[]>;
};

declare type Patient = {
  fullName: string;
  sex: 'man' | 'woman';
  bithday: string;
  address: string;
  OMS: string;
};

// TODO заменить на норм тип
declare type WSClient = {
  send(payload: Record<any, any>): void;
  notify(payload: Record<any, any>): void;
};

declare type SharedDomain = {
  rooms: Map<string, Set<WSClient>>;
  send(sender: WSClient, name: string, message: string): void;
  getRoom(name: string): Set<WSClient>;
};
