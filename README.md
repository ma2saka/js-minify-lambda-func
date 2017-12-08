# update function

```
npm install
rm app.zip && zip -r app.zip index.js node_modules/
aws lambda update-function-code \
           --profile <aws_profile> \
           --function-name <function_name> \
           --zip-file fileb://$(pwd)/app.zip \
           --publish
```
