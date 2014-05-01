my-meal-plan
============

CS132: My Meal Plan

Features Completed:
----------
* Dining Halls
  - For each hall: the day's menu
  - For each hall: the day's hours
  - Real-time access to whether or not the hall is open
  - What is currently being served
  - Images of the dining halls
* MyDining
  - Credits/Points: allows user to sign in with Brown credentials to the GetPortal displaying credits/points.  Allows user to calculate how many credits/points they should spend per day
  - Log purchase: Users can look up an item by dining hall, add it to  a cart to see the total and receive suggestions on how best to fill up a credit, report missing items and add missing flavors to items.
  - Previous Transactions: displays logged purchases from previous days for future reference
  - Browse items: look up prices and rate them (1 - 5 avocados)
* Specials:
  - See the main item offered at a dining hall at a given time
  - Get suggestions (Random if not logged in, or computed through ML KNN algorithms if signed in)
* Authentication
   - uses Google oauth sign-in
   - Once logged in, user creates an account with us, by rating a few items
   - When logged in, the user can see log purchase/browse items/prev transactions
* Mod page for administrators to see bug log and approve additions to the DB
* Full-Site implementation and partial mobile site

TODO:
---------
* Mobile CSS bugs
  - Credits/Points page shows up weirdly
  - On iOS - report a bug doesn't work
  - On Android, add flavor/type button triggered whenever something is added to cart
  - Specials at a glance text runs off screen on most mobile devices
  - Hovering is weird on mobile
* General CSS bugs:
  - would be nice to avoid Popup windows eveywhere
  - BlueRoom menu should be re-designed
* Other bugs
  - "surprise me" not functional yet
  - MLCLient not being populated with users

* Features that would be nice
  - Previous transactions broken down by dining hall
  - Ratty menu broken down by stations
  - Scanning items, but seems impractical without BDS info
