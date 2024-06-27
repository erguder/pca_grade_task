<?php

namespace App;

/**
 * Class FormProcessor
 * 
 * Handles processing of form data
 */
class FormProcessor
{
    /**
     * Processes the form data and returns a JSON response.
     *
     * @param array $data The form data (name, email and message)
     * @return array The response data.
     */
    public function process(array $data): array
    {
        $name = $data['name'] ?? '';
        $email = $data['email'] ?? '';
        $message = $data['message'] ?? '';

        //Checks if the required entries are empty
        if (empty($name) || empty($email) || empty($message)) {
            return [
                'success' => false,
                'error' => 'All fields are required.',
            ];
        }

        //Checks if the email is written in a valid format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'success' => false,
                'error' => 'Invalid email address.',
            ];
        }

        //Returns an array with success status and data
        return [
            'success' => true,
            'data' => [
                'name' => $name,
                'email' => $email,
                'message' => $message,
            ],
        ];
    }
}
