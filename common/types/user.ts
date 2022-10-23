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

/**
 * Doing this way because this way:
 * 1] ZOD runtime type validation enum fields will be
 *    correctly able to infer exact types and will not
 *    give TS type error
 * 2] If any of the contact field is incorrect then below
 *    field 'userContactsDBFields' will immediately catch
 *    TS error so that we do not lose TS type hints and
 *    TS type check
 */
const contactsDbFields = Object.freeze([
  "id",
  "given_name",
  "family_name",
  "email",
  "met_at_location",
  "notes"
] as const);

const userContactsDBFields: readonly (keyof Contact)[] = contactsDbFields;

export type {
  User,
  Contact
};

export {
  contactsDbFields,
  userContactsDBFields
};