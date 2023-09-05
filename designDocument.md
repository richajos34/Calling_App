Husband Calling Contest API Design Document

## Data Schema Organization
The Contestant Power-Up API uses two data schemas: Contestant and PowerItem
Note: PowerItem does not have full functionality

### Contestant Schema

contestantName: The name of the contestant.
husbandName: The name of the husband.
vocalRange: The vocal range of the contestant.
location: The location of the contestant.
score: The current score of the contestant. (added for the industry challenges but not used in current project)

The Contestant schema is designed store contestant/ husband information, such as names, vocal range, location, and score.

### PowerItem Schema

contestantName: The name of the contestant who owns the power-up item.
item: The name of the power-up item.
boost: The amount of vocal range boost provided by the item.

The PowerItem schema is designed to associate power-up items with specific contestants.

## Handling "Harder" Routes

The /buyItem/:contestantName route allows contestants to purchase power-up items and add them to their inventory.

I decided to check if the contestant already owns the item to prevent duplicates. If not, it adds the item to the inventory and updates the vocal range accordingly. However I was not able to successfully update the score because the vocal range was a constant variable.

The /husbandCall/:contestantName route simulates a husband call for a contestant.

I decided to calculate the vocal range boost from the contestant's inventory items and updates the vocal range (but could not complete due to the error outlined above). Then calculate the score based on the rules and updates the contestant's score.
For the bootcamp level I checked to make sure it was a valid call and caculated the score based on the required rules.

## Response Codes and Errors

200 => OK: Used for successful requests.
201 => Created: Used when data is successfully created.
400 => Bad Request: Used for client side errors.
404 => Not Found: Used when the requested data is not found.
500 => Internal Server Error: Used for server side errors when fetching data.

I choose the response codes and error messages to provide clear feedback to users and were based on standard response codes.