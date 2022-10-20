interface User {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
}

interface Contact {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
  met_at_location: string;
  notes?: string;
}

const userContactsDBFields: readonly (keyof Contact)[] = Object.freeze([
  "id",
  "given_name",
  "family_name",
  "email",
  "met_at_location",
  "notes"
]);

export type {
  User,
  Contact
};

export {
  userContactsDBFields
};