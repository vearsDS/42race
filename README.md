Note :
- This app use cookies authentication method, please makesure you include the cookies along with every request that you made
- To get the cookies please sign in first, with connect endpoint
- in case you want to test it with postman, you can grab your cookies from network tab on your browser 'inspect element' after successfully loged in via app put it on your postman Headers (cookies ex : {client_id=xxxxxx; access_token=xxxxxx})

**ENDPOINT**

Connect Endpoint
GET https://andreas42race-837fbf15e9bf.herokuapp.com/api/account/connect

Disconnect Enpoint
POST https://andreas42race-837fbf15e9bf.herokuapp.com/api/account/disconnect

Callback Webhook Endpoint
POST https://andreas42race-837fbf15e9bf.herokuapp.com/api/strava/webhook

SubscribeWebhook Endpoint
POST https://andreas42race-837fbf15e9bf.herokuapp.com/api/strava/subscribewebhook

Account Endpoint
https://andreas42race-837fbf15e9bf.herokuapp.com/api/account/getUserAccount

Accounts Endpoint
https://andreas42race-837fbf15e9bf.herokuapp.com/api/account/getListAccounts

Activities endpoint
https://andreas42race-837fbf15e9bf.herokuapp.com/api/activity/getActivities

Activity endpoint
https://andreas42race-837fbf15e9bf.herokuapp.com/api/activity/getActivity/11678211436

Delete Activiy Endpoint
https://andreas42race-837fbf15e9bf.herokuapp.com/api/activity/11678211436
