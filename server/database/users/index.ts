import {Contact, User} from "../../../common/types/user";

const getUser = (): User => ({
    id: "12345",
    given_name: "Jane",
    family_name: "Doe",
    email: "jane@blinq.me",
});

const getContacts = (): Contact[] => {
  return [
    {
      id: "1234",
      given_name: "Terry",
      family_name: "Walker",
      email: "terry@waffles.co",
      met_at_location: "Melbourne, Australia",
      notes: "Terry has a beard.",
    },
    {
      id: "1235",
      given_name: "Terry",
      family_name: "Walker",
      email: "terry@waffles.co",
      met_at_location: "Melbourne, Australia",
      notes: "Terry has a beard.",
    },
  ];
};

export type {
  User,
  Contact
};

export {
  getUser,
  getContacts
};
