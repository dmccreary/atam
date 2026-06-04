# Quiz: Security Architecture

Test your understanding of security architecture concepts including STRIDE threat modeling, defense in depth, zero trust, authentication, authorization, encryption, API security, and SIEM. Each question is followed by a collapsed answer block.

## Questions

### Question 1

What are the five security sub-properties of the security quality attribute? Provide a one-sentence definition for each.

??? note "Answer"
    (1) **Confidentiality** — information is accessible only to those authorized to access it. (2) **Integrity** — information is modified only by authorized actors through authorized means. (3) **Availability** (security sense) — legitimate access to information and functionality is not denied to authorized users (distinct from the reliability quality attribute; here it means not denying service to authorized users rather than keeping the system running). (4) **Non-repudiation** — actions are attributable to their actors — a user cannot deny having performed an action that the system has recorded. (5) **Auditability** — all security-relevant events are recorded with sufficient detail to enable forensic analysis.

---

### Question 2

What does STRIDE stand for? Match each letter to its threat category and provide one example of each.

??? note "Answer"
    **S — Spoofing**: impersonating a user, process, or system to gain unauthorized access. *Example: attacker uses stolen credentials to authenticate as a legitimate user.* **T — Tampering**: unauthorized modification of data, code, or communications. *Example: attacker modifies financial transaction amounts in transit.* **R — Repudiation**: denying having performed an action without the system having sufficient evidence to disprove the denial. *Example: user claims they never submitted a transaction the system processed.* **I — Information Disclosure**: exposure of information to unauthorized parties. *Example: verbose error messages reveal database schema, or insufficient access controls expose another user's data.* **D — Denial of Service**: degrading or preventing legitimate access. *Example: volumetric attack overwhelming the API gateway with synthetic traffic.* **E — Elevation of Privilege**: gaining more access rights than authorized. *Example: regular user exploits a vulnerability to gain administrative access.*

---

### Question 3

A security review finds that internal microservices communicate over HTTP without TLS, because they are "on the same private network." Apply STRIDE to identify at least three specific security threats this decision creates.

??? note "Answer"
    (1) **Tampering**: any attacker who gains access to the private network (through a compromised host, misconfigured network policy, or supply chain attack) can intercept and modify inter-service HTTP messages without detection — altering transaction amounts, commands, or user data. (2) **Information Disclosure**: all inter-service communication travels in plaintext. A compromised host with network capture capability can read all communication on the network segment, including authentication tokens, personal data, and business-sensitive information. (3) **Spoofing**: without mTLS, there is no mutual authentication between services. A compromised service or a new unauthorized service can impersonate any other service on the network, as there is no cryptographic proof of service identity. The "private network" assumption is particularly dangerous in cloud environments where network isolation is provided by software-defined networking — itself subject to misconfiguration. The mitigation for all three threats is mutual TLS (mTLS), which simultaneously provides encryption and bidirectional authentication.

---

### Question 4

Which of the following best describes **Zero Trust Architecture**?

A. Trusting all traffic within the corporate network perimeter while scrutinizing external traffic  
B. Eliminating the concept of a trusted internal network — every access request must be authenticated, authorized, and encrypted regardless of origin  
C. Using zero external cloud dependencies to minimize the attack surface  
D. Requiring zero failed authentication attempts before locking an account  

??? note "Answer"
    The correct answer is **B**. Zero Trust Architecture eliminates the traditional perimeter-based trust model where internal network traffic was implicitly trusted. In Zero Trust, no traffic is implicitly trusted regardless of network origin — every access request, internal or external, must be authenticated, authorized, and encrypted. The three Zero Trust principles are: "never trust, always verify" (authenticate and authorize every request), "least privilege" (grant only minimum permissions), and "assume breach" (design as if attackers are already inside, limiting blast radius through microsegmentation). In an ATAM evaluation, "we use Zero Trust" is not a finding — it requires analysis of specific mechanisms: how is mTLS implemented, how are service identities rotated, what is the authorization model for service-to-service calls?

---

### Question 5

Explain the difference between **authentication** and **authorization** using an example from a healthcare patient portal.

??? note "Answer"
    **Authentication** is verifying that a principal is who they claim to be — proving identity. **Authorization** is determining whether an authenticated principal is permitted to perform the requested action. Example: When a nurse logs into a patient portal, the system authenticates them by verifying their username, password, and MFA token (proving they are who they claim). After authentication establishes their identity and role ("Nurse, Unit 4B"), authorization determines what they can do: they can view patient records for patients assigned to Unit 4B but cannot view records for patients in other units, cannot modify physician prescriptions, and cannot access billing information. Both must be present — authentication without authorization means any authenticated user can do anything; authorization without authentication means anyone can claim any identity.

---

### Question 6

Which OAuth 2.0 flow is most appropriate for a single-page web application (SPA) where the client secret cannot be safely stored in the browser?

A. Client Credentials Flow  
B. Implicit Flow  
C. Authorization Code Flow with PKCE  
D. Password Grant Flow  

??? note "Answer"
    The correct answer is **C**. **Authorization Code Flow with PKCE** (Proof Key for Code Exchange) is the secure pattern for single-page applications and mobile apps where client secrets cannot be safely stored. PKCE uses a cryptographic code challenge and verifier instead of a client secret, preventing authorization code interception attacks. **Implicit Flow** (B) is deprecated and insecure — it exposes access tokens directly in the URL fragment where they can be captured by browser history, referrer headers, or malicious JavaScript. **Client Credentials Flow** (A) is for service-to-service authentication without user involvement. **Password Grant Flow** (D) is also deprecated and insecure as it requires the client application to handle user credentials directly.

---

### Question 7

A (H,H) security scenario requires all PHI access to be logged within 50ms of access, written to a tamper-evident audit log. An architectural review finds that audit logging is done asynchronously and written to a regular database table. Identify the two security sub-properties at risk and explain the failure modes.

??? note "Answer"
    Two sub-properties are at risk: (1) **Auditability**: The 50ms requirement means audit logs must be written synchronously before the PHI response is returned. Asynchronous logging creates a window where PHI has been accessed but not yet logged. If the application crashes or the logging service is unavailable during that window, the access record is permanently lost — violating the audit requirement and potentially creating HIPAA compliance failures. (2) **Non-repudiation** (and Integrity): A regular database table is not tamper-evident. An attacker or malicious insider with database write access can modify or delete audit records, making it impossible to prove who accessed what. Tamper-evident alternatives include: append-only log services (AWS CloudTrail, GCP Audit Logs), write-once storage (S3 Object Lock in compliance mode), or cryptographic audit logs where each entry includes a hash of the previous entry, making modification detectable.

---

### Question 8

What is **attack surface reduction**, and how does it differ from **defense in depth** as a security architecture principle?

??? note "Answer"
    **Attack surface reduction** eliminates unnecessary attack surface — disabling unused features, closing unused ports, removing unneeded services, minimizing privileges, and reducing network-accessible interfaces. It works by removing threats entirely: an attack surface element that doesn't exist cannot be exploited. Every removed element eliminates a category of threat without requiring a compensating control. **Defense in depth** accepts that some attack surface is unavoidable (the system must expose interfaces to be useful) and applies multiple independent layers of security controls so that if one layer is bypassed, additional layers continue to protect assets. Defense in depth does not eliminate threats — it creates redundant barriers against them. The two principles are complementary: attack surface reduction minimizes what must be defended; defense in depth defends what remains.

---

### Question 9

An ATAM team evaluates a system that stores database credentials in environment variables in the deployment configuration. How would you classify this finding?

A. Non-risk — environment variables are isolated from the application code  
B. Sensitivity point — the credential rotation interval is what matters most  
C. High-severity architectural risk — secrets in environment variables are visible to any process in the container, logged in configuration management systems, and often captured in CI/CD logs  
D. Tradeoff point — security versus deployment simplicity  

??? note "Answer"
    The correct answer is **C**. Secrets stored in environment variables, configuration files, or version control are a **high-severity architectural risk** and one of the most common security architecture failures identified in ATAM evaluations. Environment variables are visible to any process in the same container, are frequently captured in CI/CD build logs, can be exposed through application crash dumps, and persist in container orchestration platform configurations. The mitigation is a secret management system (HashiCorp Vault, AWS Secrets Manager, Kubernetes Secrets with proper RBAC) that provides encrypted storage, access-controlled distribution, dynamic short-lived credentials, and audit trails for every secret access.

---

### Question 10

What is **SIEM** and why is it an architectural (not just operational) concern?

??? note "Answer"
    **SIEM** (Security Information and Event Management) is a system that aggregates, correlates, and analyzes security events from across the architecture in near-real-time to detect attacks and policy violations. SIEM is an architectural concern because: (1) **Log collection** requires all security-relevant components to generate structured logs in a format the SIEM can ingest — this is an architectural instrumentation requirement, not a post-deployment addition. (2) **Correlation rules** must be defined based on the system's specific threat model (STRIDE analysis) and security scenarios. (3) **Response automation** requires architectural hooks: the SIEM must be able to trigger actions (account lockout, alert escalation, service isolation) in the system. (4) ATAM security scenarios that require detection and response within bounded time windows (e.g., "account compromise pattern must trigger lockout within 60 seconds") are only achievable if the SIEM is integrated at the architectural level, not bolted on afterward.

---

### Question 11

Scenario: A team claims their API is secure because "we have OAuth 2.0." What specific questions would an ATAM evaluator ask to determine whether this constitutes a security non-risk or requires further risk documentation?

??? note "Answer"
    "We have OAuth 2.0" requires investigation before it can be classified. Questions to ask: (1) **Which OAuth flows are used?** Authorization Code + PKCE for browser clients? Client Credentials for service-to-service? Implicit flow is deprecated and insecure and should never be used. (2) **Where are access tokens stored on clients?** LocalStorage is vulnerable to XSS; HttpOnly Secure cookies are safer for browser applications. (3) **What is the token lifetime?** Short-lived tokens (15 minutes for access tokens) limit blast radius from token theft; long-lived tokens amplify it. (4) **Is token revocation supported?** Can a compromised token be invalidated before it naturally expires, and how quickly do resource servers reflect the revocation? (5) **Is scope enforcement implemented?** Do access tokens have specific, limited scopes, or are they broad enough to access all resources? (6) **Is the audience (aud) claim validated?** This prevents a token issued for Service A from being used at Service B. Each of these is a potential sensitivity point or risk for authentication and authorization scenarios.

---

### Question 12 (Analyze)

An architecture uses Role-Based Access Control (RBAC) for a healthcare system with three roles: Patient (can view their own records), Clinician (can view records of patients under their care), and Administrator (can view all records). A STRIDE analysis identifies a Broken Object Level Authorization (BOLA) risk: the API endpoint `GET /api/patients/{patientId}/records` returns records to any authenticated Clinician, regardless of whether that Clinician has a care relationship with the patient. Analyze this finding using ATAM security quality attribute vocabulary, and describe the architectural change required.

??? note "Answer"
    **ATAM classification**: This is an **architectural risk** for a security scenario involving the Confidentiality sub-property. A well-formed security scenario would be: "An authenticated Clinician with no care relationship to patient X requests patient X's medical records; the system returns an authorization error and logs the access attempt within 100ms." The current architecture fails this scenario because authorization is checked at the role level (Clinician role = can access patient records) but not at the object level (does this Clinician have a care relationship with *this specific patient*?). This is OWASP's Broken Object Level Authorization (BOLA) — the most critical API security vulnerability. **Architectural change required**: The authorization layer must be enhanced to perform resource-level access control in addition to role-level access control. For each request to `GET /api/patients/{patientId}/records`, the authorization component must: (1) verify the requester has the Clinician role (existing role check), AND (2) verify the requester has an active care relationship with the specified patientId by querying the care relationship data store. This is a move from RBAC toward Attribute-Based Access Control (ABAC) where the patient's care assignments are an attribute used in the authorization decision. The sensitivity point is the performance impact of the care relationship lookup on the authorization path — it must complete within the latency budget of the API response.

---

*End of Quiz — Chapter 14*
