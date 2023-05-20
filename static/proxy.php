<?php

$config = include('config.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postdata = file_get_contents('php://input');
    $ch = curl_init("http://" . $config["thermostat_ip_address"] . "/tstat");
    curl_setopt( $ch, CURLOPT_POSTFIELDS, $postdata );
    curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
    $data = curl_exec($ch);
    curl_close($ch);
    echo $data;
} 
else 
{
    $ch = curl_init("http://" . $config["thermostat_ip_address"] . "/tstat"); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    $data = curl_exec($ch);
    curl_close($ch);
    echo $data;
}

exit();
?>