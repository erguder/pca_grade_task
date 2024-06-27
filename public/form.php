<?php

//Composer's autoloader
require_once '../vendor/autoload.php';

//FormProcessor class import
use App\FormProcessor;

//Indicate JSON content type
header('Content-Type: application/json');

//Process the form data received via POST request
$formProcessor = new FormProcessor();
$response = $formProcessor->process($_POST);

//Encode the response
echo json_encode($response);