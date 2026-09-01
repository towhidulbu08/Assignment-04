ক্রম (Order) অত্যন্ত গুরুত্বপূর্ণ — যেই model অন্য model-কে reference করে, সেই referenced model-টা আগে বানাতে হবে:

1. Category (কারো উপর নির্ভর করে না)
2. User (কারো উপর নির্ভর করে না)
3. GearItem (User + Category লাগে)
4. RentalOrder (User লাগে)
5. RentalItem (RentalOrder + GearItem লাগে)
6. Payment (RentalOrder + User লাগে)
7. Review (User + GearItem + RentalOrder লাগে)
