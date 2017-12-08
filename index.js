var aws = require('aws-sdk');
var s3 = new aws.S3({
  apiVersion: '2006-03-01'
});
var uglify = require("uglify-js");

exports.handler = function (event, context) {
  // バケット名
  var bucket = event.Records[0].s3.bucket.name;

  //JSファイル名
  var key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  if (!key.includes(".orig.")) {
    context.done()
  }

  var params = {
    Bucket: bucket,
    Key: key
  };

  //S3のファイルを取得
  s3.getObject(params, function (err, data) {
    if (err) {
      context.fail(err)
    } else {
      var data = uglify.minify(new Buffer(data.Body).toString())

      // .orig. を .min. に置き換えるぞ
      s3.putObject({
          Bucket: params.Bucket,
          Key: params.Key.replace(/\.orig\./, ".min."),
          Body: data.code
        },
        function (err, data) {
          if (err) {
            context.fail()
          } else {
            context.done()
          }
        })
    }
  })
};