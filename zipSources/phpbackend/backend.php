<?php
$out = [];
$payload = [];
$m = new MongoClient();
	
define('scriptVars', 'global $_input; global $_out; global $payload; global $m; global $user;');
	
require('/api/base/inputsans.php');
require('/api/base/logging.php');
require('/api/base/authenticate.php');
require('/api/base/authorize.php');

#{SWITCH}#

$_out['payload'] = $payload;
$_out['result'] = 'SUCCESS';
echo json_encode($_out);