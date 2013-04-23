<?php
  $apiKey = '1308a074a9324e94f1c401eb82b6a1e7-us6';
  $listId = 'b160cc64ec';
  $double_optin=false;
  $send_welcome=false;
  $email_type = 'html';
  
  $email = $_POST['email'];
  $name = $_POST['name'];
  $merges = array('FNAME'=>$name);



  //replace us2 with your actual datacenter
  $submit_url = "http://us6.api.mailchimp.com/1.3/?method=listSubscribe";
  $data = array(
      'email_address' => $email,
      'apikey'        => $apiKey,
      'id'            => $listId,
      'double_optin'  => $double_optin,
      'send_welcome'  => $send_welcome,
      'email_type'    => $email_type,
      'merge_vars'    => $merges
  );


  $payload = json_encode($data);
   
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $submit_url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS, urlencode($payload));
   
  $result = curl_exec($ch);
  curl_close ($ch);
  $data = json_decode($result);
  if ($data->error){
      echo json_encode(array(
        'error' => $data->error,
        'data' => $data->error
      ));

  } else {
    echo json_encode(array(
			   'data' => "<p>Obrigado pelo interesse! Logo traremos novidades!</p>"
    ));
  }
?>