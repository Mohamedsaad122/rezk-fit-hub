export const SdkGeneratorService = {
    generateSdkCode: (language, apiKey) => {
        const key = apiKey || 'YOUR_API_KEY';
        const getRaw = () => {
            switch (language.toLowerCase()) {
            case 'javascript':
                return `
// Rezk Fit Hub JavaScript SDK
class RezkFitHubSDK {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.rezkfit.com/v1';
    }

    async getClients() {
        const res = await fetch(\`\${this.baseUrl}/clients\`, {
            headers: { 'Authorization': \`ApiKey \${this.apiKey}\` }
        });
        return res.json();
    }
}
const sdk = new RezkFitHubSDK('${key}');
sdk.getClients().then(console.log);
                `.trim();

            case 'typescript':
                return `
// Rezk Fit Hub TypeScript SDK
export interface Client {
    id: string;
    name: string;
    email: string;
}

export class RezkFitHubSDK {
    private apiKey: string;
    private baseUrl = 'https://api.rezkfit.com/v1';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    public async getClients(): Promise<Client[]> {
        const res = await fetch(\`\${this.baseUrl}/clients\`, {
            headers: { 'Authorization': \`ApiKey \${this.apiKey}\` }
        });
        return res.json();
    }
}
                `.trim();

            case 'react':
                return `
// Rezk Fit Hub React Wrapper hook
import React, { createContext, useContext } from 'react';

const SDKContext = createContext(null);

export const RezkFitHubProvider = ({ apiKey, children }) => {
    const getClients = async () => {
        const res = await fetch('https://api.rezkfit.com/v1/clients', {
            headers: { 'Authorization': \`ApiKey \${apiKey}\` }
        });
        return res.json();
    };

    return (
        <SDKContext.Provider value={{ getClients }}>
            {children}
        </SDKContext.Provider>
    );
};

export const useRezkFitHub = () => useContext(SDKContext);
                `.trim();

            case 'node.js':
            case 'nodejs':
                return `
// Rezk Fit Hub Node.js SDK
const axios = require('axios');

class RezkFitHubNodeSDK {
    constructor(apiKey) {
        this.client = axios.create({
            baseURL: 'https://api.rezkfit.com/v1',
            headers: { 'Authorization': \`ApiKey \${apiKey}\` }
        });
    }

    async getClients() {
        const response = await this.client.get('/clients');
        return response.data;
    }
}
module.exports = RezkFitHubNodeSDK;
                `.trim();

            case 'python':
                return `
# Rezk Fit Hub Python SDK
import requests

class RezkFitHubSDK:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.rezkfit.com/v1"

    def get_clients(self):
        headers = {"Authorization": f"ApiKey {self.api_key}"}
        response = requests.get(f"{self.base_url}/clients", headers=headers)
        return response.json()

sdk = RezkFitHubSDK("${key}")
print(sdk.get_clients())
                `.trim();

            case 'php':
                return `
<?php
// Rezk Fit Hub PHP SDK
class RezkFitHubSDK {
    private $apiKey;
    private $baseUrl = "https://api.rezkfit.com/v1";

    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }

    public function getClients() {
        $opts = [
            "http" => [
                "header" => "Authorization: ApiKey " . $this->apiKey . "\\r\\n"
            ]
        ];
        $context = stream_context_create($opts);
        return json_decode(file_get_contents($this->baseUrl . "/clients", false, $context));
    }
}
                `.trim();

            case 'java':
                return `
// Rezk Fit Hub Java SDK
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class RezkFitHubSDK {
    private final String apiKey;
    private final HttpClient client = HttpClient.newHttpClient();

    public RezkFitHubSDK(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getClients() throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.rezkfit.com/v1/clients"))
            .header("Authorization", "ApiKey " + apiKey)
            .build();
        return client.send(request, HttpResponse.BodyHandlers.ofString()).body();
    }
}
                `.trim();

            case 'c#':
            case 'csharp':
                return `
// Rezk Fit Hub C# .NET SDK
using System;
using System.Net.Http;
using System.Threading.Tasks;

public class RezkFitHubSDK {
    private readonly HttpClient _client;

    public RezkFitHubSDK(string apiKey) {
        _client = new HttpClient();
        _client.BaseAddress = new Uri("https://api.rezkfit.com/v1/");
        _client.DefaultRequestHeaders.Add("Authorization", $"ApiKey {apiKey}");
    }

    public async Task<string> GetClientsAsync() {
        return await _client.GetStringAsync("clients");
    }
}
                `.trim();

            case 'flutter':
                return `
// Rezk Fit Hub Flutter SDK
import 'package:http/http.dart' as http;
import 'dart:convert';

class RezkFitHubSDK {
    final String apiKey;
    final String baseUrl = 'https://api.rezkfit.com/v1';

    RezkFitHubSDK({required this.apiKey});

    Future<List<dynamic>> getClients() async {
        final response = await http.get(
            Uri.parse('$baseUrl/clients'),
            headers: {'Authorization': 'ApiKey $apiKey'},
        );
        return jsonDecode(response.body);
    }
}
                `.trim();

            default:
                throw new Error(`Unsupported SDK Language: ${language}`);
        }
        };
        return `// Rezk Fit Hub SDK for ${language} (Key: ${key})\n` + getRaw();
    }
};

export default SdkGeneratorService;
