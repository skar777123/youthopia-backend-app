# API Documentation & Flow

## 1. User Authentication & Profile
- **Register**: `POST /user/register`  
  - Creates user, assigns `Yid` (Youthopia ID), initial points (5), and spin check logic (spins=0).
- **Login**: `POST /user/login`
- **Get Data**: `GET /user/data/:yid`  
  - Returns user profile including points, spins, registered events, etc.
- **Get Points**: `GET /user/points/:yid`
- **Get Spins**: `GET /user/spins/:yid`
- **Delete User**: `DELETE /user/:yid`

## 2. Events & Participation (Flow)
1. **List Events**: `GET /event`  
   - Supports filtering, e.g., `GET /event?category=Sports`
2. **Details**: `GET /event/:id`
3. **Participate**: `POST /event/:id/participate`  
   - Body: `{ "Yid": "...", "name": "...", "_id": "...", "team": "..." (optional), "points": 10 (optional) }`
   - **Logic**: 
     - Registers user for event.
     - Adds event to user's `registered` list.
     - Awards points if specified in body.
     - **Bonus**: Every 4th event registration awards +1 Spin to the user.
4. **Complete Event**: `POST /event/:id/complete`  
   - Body: `{ "Yid": "...", "name": "...", "_id": "..." }`
   - **Logic**:
     - Marks event as completed for user.
     - Awards event's defined points to user.
     - Updates Leaderboard.

## 3. Rewards & Redemption (Flow)
1. **Spin Wheel**: `POST /user/spin/:yid`
   - Body (Optional): `{ "points": 50, "spins": 1 }` (Admin/Dev override)
   - Default: Uses 1 spin, awards random points (1-100).
2. **List Redeem Items**: `GET /redeem`
3. **Claim Item**: `POST /redeem/:id/claim`
   - Body: `{ "userId": "YID123" }`
   - **Logic**:
     - Checks user points >= item points.
     - Deducts points.
     - Creates a **Pending Transaction**.
     - Adds transaction to Redeem Item's `transactions` objects (Pending list).
4. **Approve Redemption** (Admin): `POST /redeem/:id/approve`
   - Body: `{ "transactionId": "..." }`
   - **Logic**:
     - Finds the pending transaction in `transactions`.
     - Moves it to `approved` object.
     - Increments `completed` count for the Redeem Item.
     - This signifies the user has received their reward.

## 4. Leaderboard
- Updated automatically on:
  - Registration
  - Event Participation (if points awarded)
  - Event Completion
  - Spin Wheel
  - Redemption
