var RISK = 3; // 0: info, 1: low, 2: medium, 3: high
// StackHawk doesn't display INFO alerts
var TITLE = "ScottyCo Brewing Custom Tenant Check";
var DESCRIPTION = `A ScottyCo user was able to obtain information about another user it should not have been able to.
                    Please see internal WIKI about ScottyCo tenancy checks at
                    https://example.com/wiki/ssdlc/tennancy`;
var SOLUTION = "Implement Correct Spring AuthZ Annotation on user object.";
var REFERENCE = "https://something.that.shows.the.problem.com/OMG";
var OTHER = "If you run into ploblems, reach out to the security team on slack #appsechalp";

function log(msg) {
    print("[" + this["zap.script.name"] + "]" + msg);
}


function alert(as, msg, evidence) {
  as.newAlert()
    .setPluginId(1000012)
    .setRisk(RISK)
    .setName(TITLE)
    .setDescription(DESCRIPTION)
    .setEvidence(evidence)
    .setOtherInfo(OTHER)
    .setSolution(SOLUTION)
    .setReference(REFERENCE)
    .setMessage(msg)
    .raise();

    }


 function scan(as, msg, param, value) {

 }

 function scanNode(as, msg) {
    var uri = msg.getRequestHeader().getURI();

    log("scanning ", uri);

    // copy requests before using them or bad things
    msg = msg.cloneRequest();

    var request_header = msg.getRequestHeader();
    uri = request_header.getURI();

    var path = "";
    if (uri.getPath() != null && uri.getPath().length() >1) {
        path = uri.getPath().toString() + "/user";
    } else {
        path = "/user";
    }
    uri.setPath(path);

    log("scanning 2" + uri);

    request_header.setHeader("Content-Type", "application-json");

    as.sendAndReceive(msg, false, false);

    var response_header = msg.getResponseHeader();
    var response_body = msg.getResponseBody();

    log("response body: ", response_body);
    log("response header: ", response_header);

    //check for evidence of problem
    var evidence_idx = response_body.toString().indexOf("12345678");

    log(msg);

    // Test the response here and make other requests as needed
    if (response_header.getStatusCode() == 200 && evidence_idx >=0) {
        alert(as, msg, "12345678");
    }
 }