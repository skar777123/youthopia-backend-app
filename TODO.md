# TODO: Implement User Registration for Events

## Steps to Complete

- [x] Update src/schema/event.schema.ts to add 'isTeam' boolean field (default false)
- [x] Create src/user/dto/register-single.dto.ts for single user registration
- [x] Create src/user/dto/register-team.dto.ts for team registration
- [x] Edit src/user/user.service.ts to add registerSingle and registerTeam methods
- [x] Edit src/user/user.controller.ts to add register-single and register-team endpoints
- [x] Test the endpoints for both single and team registrations
- [ ] Update related modules if needed (e.g., app.module.ts)
