### public/photos

This is where uploaded photos reside.  When an API call is made to create a new car, a directory is created to store pictures of that car.  The directory name is the inventory ID.  For example, public/photos/933066 would contain image files for vehicle with inventory ID 933066.

A .gitignore file is used to ignore any directories created in public/photos so as not to commit uploaded photos.  