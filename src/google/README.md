# HOW TO SET UP GOOGLE API

this is convoluted and confusing as hell  
I will try and fail to document what is needed to do  
this is also out of order   

create google cloud project https://developers.google.com/workspace/guides/create-project

enable google sheets api and google drive api in https://console.cloud.google.com/apis/library

Possibly optional IDK: https://console.cloud.google.com/auth/branding

create "Service Accounts" keys in https://console.cloud.google.com/apis/credentials and download json 

make sure you don't commit them as they have different filenames

rename the keys to credential.json or add the name to .gitignore

Where did I enable the scope? Custom roles or something. https://cloud.google.com/iam/docs/creating-custom-roles

## Documentations

https://developers.google.com/drive/api/guides/about-sdk

