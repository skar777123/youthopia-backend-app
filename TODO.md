# TODO List for User and Event Modules Implementation

- [ ] Update app.module.ts to include MongooseModule and CacheModule for Redis
- [ ] Generate User module using Nest CLI
- [ ] Generate Event module using Nest CLI
- [ ] Create DTOs for User (CreateUserDto, LoginDto, RedeemDto, SpinWheelDto)
- [ ] Create DTOs for Event (if needed)
- [ ] Implement UserService with methods: register, login, fetchData, redeem, spinWheel, getPoints (with Yid generation and Redis caching)
- [ ] Implement EventService with methods: fetchData, getLeaderboard, getSchedule
- [ ] Create UserController with endpoints for registration, login, fetchdata, redeem, spin wheel, points fetch
- [ ] Create EventController with endpoints for fetch data, leaderboard, event schedule
- [ ] Test the application and endpoints
