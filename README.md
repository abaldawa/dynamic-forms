# dynamic-forms
## Author: Abhijit Baldawa

### Description
A Next.js, Typescript based fullstack project to create dynamic forms by defining a form schema(which is built from scratch and is fully typed in Typescript) and giving the user defined form schema to a form builder (it is also build from scratch) which then builds the form by reading the user defined form schema accordingly and also outputs the data as defined in the schema along with any validations mentioned in the schema.

Everything is 100% typed in Typescript with full code completion and data is validated fully on the backend using ZOD.

### Tech Stack
1. Backend: Next.js/Typescript exposing REST API's
2. Front end: React.js/Next.js/Typescript
3. Data validation: ZOD


### User interface
Below gif shows the output of this repo.

![dynamic-forms-usage](https://user-images.githubusercontent.com/5449692/197034123-6324c860-7b24-4e40-8138-c51f1b254ee2.gif)

### REST Api's
Below REST Api's are exposed to be consumed by the UI.
1. GET /api/integrations - Gets all integrations of a user
2. POST /api/integrations - Create a new integration for a user
3. PATCH /api/integrations/:id - Updates an existing integration of a user
4. DELETE /api/integrations/:id - Deletes an existing untegration of a user

To simulate logged-in behaviour pass below in the header with all REST Api's to associate a request with the userId:
```typescript
{
  headers: {
    Authorization: `Bearer ${userId}`
  }
}
```
