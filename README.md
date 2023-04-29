# Food Delivery App Backend

## Dependencies
 ```
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.1.0",
    "nodemon": "^2.0.22"
```

## Model

- User Model

```
    name: {type:String ,required:true},
    email: {type:String ,required:true},
    password: {type:String ,required:true},
    address: {
      street: {type:String ,required:true},
      city: {type:String ,required:true},
      state: {type:String ,required:true},
      country: {type:String ,required:true},
      zip: {type:String ,required:true}
    }
```

- Order Model
```
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required:true},
    restaurant : { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant',required:true },
  items: [{
    name: {type:String ,required:true},
    price: {type:Number ,required:true},
    quantity: {type:Number ,required:true},
  }],
  totalPrice: Number,
  deliveryAddress: {
    street: {type:String ,required:true},
    city: {type:String ,required:true},
    state: {type:String ,required:true},
    country: {type:String ,required:true},
    zip: {type:String ,required:true}
  },
  status: {type:String, required:true, enum:["placed", "preparing", "on the way", "delivered"]}
```

- Restaurant Model 
```
name: {type:String ,required:true},
    address: {
      street: {type:String ,required:true},
      city: {type:String ,required:true},
      state: {type:String ,required:true},
      country: {type:String ,required:true},
      zip: {type:String ,required:true}
    },
    menu: [menuSchema]

    >  Menu Schema
        name: {type:String ,required:true},
        description: {type:String ,required:true},
        price: {type:Number ,required:true},
        image: {type:String ,required:true}
```

## Routes

---
### This endpoint allow users to register and Hash the password on store.
> POST : /api/register

> **body***: `{name, email, password,address: {street,city:,state: ,country,zip}`

---
### This endpoint allow users to login and Return JWT token on login.
> POST : /api/register
> **body***: `{email, password}`
---
###  This endpoint allow users to reset the password identified by user id, providing the current password and new password in the body.
> PATCH : /api/user/:id/reset 
> **body***: `{ password,new_password}`
---
### This endpoint return a list of all available restaurants.
> GET : /api/restaurants 
---
### This endpoint  return the details of a specific restaurant identified by its ID.
> GET :  /api/restaurants/:id 
---
### This endpoint  return the menu of a specific restaurant identified by its ID.
>  GET :  /api/restaurants/:id/menu 
---
###  This endpoint  allow the user to add a new item to a specific restaurants menu identified by it id.
>  POST : /api/restaurants/:id/menu 
> **body***: `{name,description,price,image"}`
---
###  This endpoint allow the user to delete a particular menu item identified by its id from a specific restaurant.
> DELETE : /api/restaurants/:id/menu/:id
---
###  This endpoint allow the user to place an order.
> POST : /api/orders 
---
### This endpoint return the details of a specific order identified by its ID.
> GET : /api/orders/:id 
---
### This endpoint allow users to update the status of a specific order identified by its ID.
> PATCH : /api/orders/:id 
