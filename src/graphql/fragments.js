import { gql } from "apollo-boost";

export const userFields = gql`
  fragment userFields on users {
    id
    username
    name
    profile_image
  }
`;
