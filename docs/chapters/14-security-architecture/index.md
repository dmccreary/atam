---
title: Security Architecture
description: Security architecture from threat modeling and STRIDE through zero trust, authentication, authorization, encryption, SIEM, least privilege, and security scenario development — integrating security analysis into ATAM evaluations.
generated_by: claude skill chapter-content-generator
date: 2026-06-03 02:50:00
version: 0.08
---

# Security Architecture

## Summary

Security is one of the quality attributes most frequently evaluated in ATAM, and it demands its own architectural vocabulary and analytical toolkit. This chapter covers security architecture from first principles — threat modeling using STRIDE, attack surface reduction, and defense in depth — through the major structural mechanisms: zero trust, authentication and authorization, encryption at rest and in transit, OAuth 2.0, API security, and secret management. Students also learn how to develop security scenarios for ATAM workshops, use the security tactic catalog, and integrate identity and access management, SIEM, and incident response into architectural evaluation.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

1. Security Architecture Definition
2. Threat Modeling
3. STRIDE Threat Model
4. Attack Surface Reduction
5. Defense in Depth
6. Zero Trust Architecture
7. Authentication Architecture
8. Authorization Architecture
9. Encryption at Rest
10. Encryption in Transit
11. OAuth 2.0 Architecture
12. API Security Design
13. Secret Management
14. Security Monitoring
15. Intrusion Detection System
16. SIEM Architecture
17. Least Privilege Principle
18. Security Compliance
19. Secure Dev Lifecycle (SDLC)
20. Penetration Testing in Arch
21. Security Scenario Development
22. Security Tactic Catalog
23. Identity and Access Management
24. Security Incident Response
25. Privacy by Design

## Prerequisites

This chapter builds on concepts from:

- [Chapter 5: Quality Attributes](../05-quality-attributes/index.md)
- [Chapter 6: Quality Attribute Scenarios](../06-quality-attribute-scenarios/index.md)
- [Chapter 9: Architectural Tactics and Design Principles](../09-architectural-tactics-principles/index.md)
- [Chapter 11: Distributed Systems Architecture Fundamentals](../11-distributed-systems-fundamentals/index.md)

---

!!! mascot-welcome "Security: The ATAM Superpower You Can't Afford to Miss"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Vista waving welcome">
    Fellow architects, from up here Vista can see something that makes experienced security professionals nod: security is never "added" to an architecture — it must be *designed into* it from the start. An architecture that achieves excellent performance, availability, and scalability but has fundamental security gaps is not a good architecture. It is an architecture waiting to become a breach headline. This chapter gives you the security evaluation toolkit — the threat modeling vocabulary, the security tactic catalog, and the scenario construction skills — to evaluate security as rigorously as any other quality attribute in your ATAM toolkit. Let's weigh those tradeoffs!

## Security Architecture: A Precise Definition

**Security architecture** is the set of architectural decisions that govern a system's ability to protect its assets — data, functionality, and computational resources — from unauthorized access, disclosure, modification, disruption, and harm.

The foundational security sub-properties are:

- **Confidentiality:** Information is accessible only to those authorized to access it
- **Integrity:** Information is modified only by authorized actors through authorized means
- **Availability:** Legitimate access to information and functionality is not denied (distinguishing this from availability as a separate quality attribute: here we mean availability in the security sense — not denying service to authorized users, as opposed to the reliability sense of keeping the system running)
- **Non-repudiation:** Actions are attributable to their actors — a user cannot deny having performed an action that the system has recorded
- **Auditability:** All security-relevant events are recorded with sufficient detail to enable forensic analysis

These sub-properties map directly to ATAM scenario components. A well-formed security scenario specifies which sub-property is at stake (the quality attribute branch in the utility tree), what the threat stimulus is (the attack event), under what environmental conditions it occurs, what system element is the target, and what the required response and response measure are.

## Threat Modeling: Structured Security Analysis

**Threat modeling** is the process of systematically identifying what could go wrong — what threats exist, what assets they target, and what mitigations are needed. Threat modeling is the security architect's equivalent of scenario analysis: it transforms vague "the system must be secure" requirements into specific, analyzable threat scenarios.

**STRIDE** is the most widely used threat classification framework for software systems. The acronym covers six threat categories:

- **S — Spoofing:** Impersonating a user, process, or system to gain unauthorized access. Example: an attacker uses a stolen credential to authenticate as a legitimate user.
- **T — Tampering:** Unauthorized modification of data, code, or communications. Example: an attacker modifies financial transaction amounts in transit.
- **R — Repudiation:** A user or process denying that it performed an action, without the system having sufficient evidence to disprove the denial. Example: a user claims they never submitted a transaction that the system processed.
- **I — Information Disclosure:** Exposure of information to unauthorized parties. Example: error messages revealing database schema details, or insufficient access controls exposing another user's data.
- **D — Denial of Service:** Degrading or preventing legitimate access to a system. Example: a volumetric attack overwhelming the API gateway with synthetic traffic.
- **E — Elevation of Privilege:** Gaining more access rights than authorized. Example: a regular user exploiting a vulnerability to gain administrative access.

Before a STRIDE analysis can proceed, the team must define the **attack surface** — the total set of points through which an attacker can try to enter or extract data from the system. The attack surface includes all APIs and endpoints, all authentication mechanisms, all data inputs, all communication channels, all administrative interfaces, and all dependencies (libraries, services, platforms) that the system relies on.

**Attack surface reduction** is a security tactic that eliminates unnecessary attack surface: disabling unused features, closing unused ports, removing unneeded services, minimizing privileges, and reducing the number of network-accessible interfaces. Every removed attack surface element is a threat that no longer needs to be mitigated.

#### Diagram: STRIDE Threat Model Explorer

<iframe src="../../sims/stride-threat-explorer/main.html" width="100%" height="560px" scrolling="no"></iframe>

<details markdown="1">
<summary>STRIDE Threat Model Explorer</summary>
Type: diagram
**sim-id:** stride-threat-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive system diagram (data flow diagram style) for a realistic example system (healthcare patient portal), with STRIDE threat categories applied to each component and data flow — allowing students to identify threats at each point.

Bloom Level: Apply (L3) — Use the STRIDE framework to identify threats at specific components and data flows in a system architecture.
Bloom Verb: Use (Apply STRIDE)

Learning Objective: Students will be able to apply the STRIDE framework to a system's data flow diagram, identifying at least one threat from each STRIDE category for the depicted system.

Canvas layout:
- Data flow diagram showing: Browser/Mobile Client, API Gateway, Authentication Service, Patient Portal Service, EHR Integration, Database
- Arrows showing data flows between components, labeled with flow type (patient data, auth token, prescriptions)
- Each component shown as a rounded rectangle; data stores as double-horizontal-lined rectangles; external entities as rectangles
- Trust boundary lines (dashed) separating untrusted (client), trusted (internal services), and highly trusted (database) zones

Interaction:
- Click any component or data flow arrow to open a STRIDE analysis panel for that element
- Panel shows the six STRIDE categories with a description of the relevant threat for that element
- "Add Mitigation" button per threat to record a mitigation strategy
- Toggle "Show Trust Boundaries" to highlight zones

Example STRIDE analysis for API Gateway:
- Spoofing: Attacker uses stolen JWT token to authenticate as legitimate user → Mitigation: Token binding, short token lifetime, revocation list
- Tampering: Attacker modifies API request payload in transit → Mitigation: HTTPS with certificate pinning
- Repudiation: API calls not logged with sufficient detail → Mitigation: Structured request logging with user ID, timestamp, operation, outcome
- Information Disclosure: Verbose error messages expose internal architecture → Mitigation: Sanitize error messages; log details internally only
- Denial of Service: Synthetic traffic overwhelms gateway → Mitigation: Rate limiting, WAF, DDoS mitigation service
- Elevation of Privilege: Forged claims in JWT token → Mitigation: Signature verification, claims validation, audience restriction

Color scheme: Red for Spoofing/Tampering/Elevation threats, Orange for Information Disclosure, Yellow for Repudiation/DoS. Blue for trusted zone, Gray for untrusted zone.

Responsive: Diagram scales to container width; components reposition proportionally.
</details>

## Defense in Depth and Zero Trust

**Defense in depth** is the security architecture principle that multiple independent layers of security controls should be applied so that if one layer is bypassed, additional layers continue to protect assets. The metaphor is a medieval castle: moat, outer walls, inner walls, keep — an attacker who bypasses any single layer still faces the remaining layers.

In software architectures, defense in depth layers include:

1. **Perimeter security:** API gateway, WAF (Web Application Firewall), DDoS mitigation — filtering threats before they reach internal services
2. **Transport security:** TLS encryption of all communications — preventing eavesdropping and tampering in transit
3. **Authentication:** Verifying identity at every service boundary — preventing unauthorized access
4. **Authorization:** Verifying that authenticated identities have permission for the requested action — preventing privilege abuse
5. **Data protection:** Encryption at rest, data masking, tokenization — protecting data even if storage is compromised
6. **Monitoring and detection:** SIEM, IDS, anomaly detection — detecting attacks that have bypassed prevention layers
7. **Incident response:** Procedures and automation for containing and recovering from successful attacks

**Zero Trust Architecture** takes defense in depth further by eliminating the traditional notion of a trusted "internal network." In traditional architectures, traffic within the corporate network was implicitly trusted — only external traffic was scrutinized. In a Zero Trust model, no traffic is implicitly trusted, regardless of origin. Every access request — internal or external — must be authenticated, authorized, and encrypted.

Zero Trust principles for architectural evaluation:

- **Never trust, always verify:** Every request must be authenticated and authorized, regardless of network location
- **Least privilege:** Every process, service, and user is given only the minimum permissions required for its function
- **Assume breach:** Design systems as if attackers are already inside the network; limit blast radius through microsegmentation and data access controls

**ATAM implication:** Zero Trust is a security architecture pattern, not a product. In ATAM evaluations, "we use Zero Trust" is not a finding — it requires analysis of the specific mechanisms in place: how is mutual TLS implemented? How are service identities established and rotated? What is the authorization model for service-to-service calls? What happens when a service's credential is compromised?

## Authentication and Authorization Architecture

**Authentication** is the process of verifying that a principal (user, service, or system) is who they claim to be. **Authorization** is the process of determining whether an authenticated principal is permitted to perform the requested action. The two are distinct and must both be present in every security architecture.

Before examining authentication patterns, let us establish a definition that matters for distributed systems: **identity** is the digital representation of a principal, typically expressed as a set of claims (name, role, permissions, tenant) in a credential. Authentication validates the identity; authorization uses the identity's claims to make access decisions.

**Authentication patterns:**

- **Username/password with MFA:** Simple, widely understood. Weakness: passwords are frequently compromised through phishing, breaches, and weak selection.
- **Certificate-based authentication (mTLS):** Service identity proven by a cryptographic certificate. Standard for service-to-service authentication in Zero Trust architectures.
- **OAuth 2.0 / OpenID Connect:** Delegated authentication — a user authenticates to an Identity Provider (IdP) and receives tokens (ID token for identity, access token for authorization). The most widely deployed pattern for modern web and mobile applications.

**OAuth 2.0** deserves detailed treatment because it is the dominant authentication and authorization protocol for modern APIs. OAuth 2.0 defines a framework for delegated authorization: a resource owner (user) grants a client application access to resources on a resource server, mediated by an authorization server. The client receives an **access token** — a credential that the resource server validates before serving the request.

Key OAuth 2.0 flows in architectural context:

- **Authorization Code Flow:** The most secure flow for user-facing applications; the access token is never exposed to the browser
- **Client Credentials Flow:** Service-to-service authentication without user involvement; the client authenticates directly to the authorization server
- **PKCE (Proof Key for Code Exchange):** Extension of Authorization Code Flow for mobile and single-page applications where client secrets cannot be safely stored

**Authorization Architecture:**

- **Role-Based Access Control (RBAC):** Access decisions based on the user's role. Simple and widely implemented but inflexible for fine-grained permissions.
- **Attribute-Based Access Control (ABAC):** Access decisions based on attributes of the user, resource, and environment. Highly flexible but complex to implement and manage.
- **Permission-Based Access Control:** Explicit permission grants per operation — neither role-based nor attribute-based. Used in systems where fine-grained control is required.

**Identity and Access Management (IAM)** is the architectural component responsible for managing identities, credentials, authentication, and authorization policies across the system. Cloud providers' IAM services (AWS IAM, Azure AD, Google Cloud IAM) are managed IAM implementations.

## Encryption: At Rest and In Transit

Two forms of encryption address different attack vectors:

**Encryption in transit** protects data as it moves between components — through networks, between services, between client and server. TLS (Transport Layer Security) is the standard mechanism. For service-to-service communication within a cluster, mutual TLS (mTLS) provides bidirectional authentication in addition to encryption.

ATAM sensitivity point: TLS version and cipher suite configuration. TLS 1.2 and 1.3 are the secure versions; TLS 1.0 and 1.1 are deprecated and vulnerable. A system that permits TLS 1.0 connections is a security risk.

**Encryption at rest** protects data stored in databases, object storage, and file systems — protecting against attackers who gain physical or logical access to the storage layer. Modern databases and cloud storage services support encryption at rest with minimal configuration. The critical architectural concerns are:

- **Key management:** Who holds the encryption keys? Where are they stored? How are they rotated? Keys stored in the same location as the encrypted data provide no protection.
- **Key access control:** Who can access the keys? An attacker who compromises a service that has key access can decrypt the data.
- **Key rotation:** Periodic rotation of encryption keys limits the blast radius of a key compromise.

**Secret management** is the discipline of storing, distributing, and rotating sensitive configuration values (API keys, database passwords, encryption keys, certificates) without exposing them in code, configuration files, or version control. Secret management systems (HashiCorp Vault, AWS Secrets Manager, Kubernetes Secrets) provide:

- Encrypted storage of secrets
- Access control policies (only specific services can access specific secrets)
- Dynamic secrets (short-lived credentials generated on demand and automatically revoked)
- Audit trails (every secret access is logged)

**ATAM risk finding:** Secrets stored in environment variables, configuration files, or (especially) version control repositories are a high-severity security risk. This is one of the most common security architecture failures in ATAM evaluations and one of the easiest to identify.

#### Diagram: Security Architecture Layers

<iframe src="../../sims/security-architecture-layers/main.html" width="100%" height="560px" scrolling="no"></iframe>

<details markdown="1">
<summary>Security Architecture Defense-in-Depth Layers</summary>
Type: diagram
**sim-id:** security-architecture-layers<br/>
**Library:** p5.js<br/>
**Library:** vis-network<br/>
**Library:** p5.js<br/>
**Status:** Specified

Purpose: Interactive visualization of defense-in-depth security layers for a modern web application, showing how each layer intercepts specific attack types and what security mechanisms are present at each layer.

Bloom Level: Analyze (L4) — Examine how defense-in-depth layers address specific STRIDE threat categories and identify which layers are missing or insufficient.
Bloom Verb: Examine

Learning Objective: Students will be able to map STRIDE threat categories to the defense-in-depth layers that address them, identify security layer gaps, and determine which attacks would succeed if a specific layer were absent.

Canvas layout:
- Concentric rings (target/bullseye style) from outer to inner: Perimeter, Transport, Authentication, Authorization, Data, Monitoring
- Each ring contains labeled security mechanisms (e.g., WAF, DDoS mitigation in Perimeter ring)
- Attack vectors shown as arrows approaching from the outside, stopped at the appropriate ring
- Click any ring to see the mechanisms in that layer and which STRIDE threats they address
- Toggle individual rings "on" or "off" to see what attacks would reach the next layer

Ring contents:
Perimeter: WAF, DDoS mitigation, IP allowlisting, rate limiting
Transport: TLS 1.3, mTLS for service-to-service, certificate management
Authentication: MFA, OAuth 2.0 / OIDC, mTLS client certs, session management
Authorization: RBAC, ABAC, permission validation, resource-level access control
Data: Encryption at rest, field-level encryption, tokenization, data masking
Monitoring: SIEM, IDS/IPS, anomaly detection, security event logging, incident response

Attack vectors (arrows):
- Volumetric DDoS → stopped at Perimeter by DDoS mitigation
- SQL injection via API → stopped at Transport/Auth layers by input validation
- Credential stuffing → stopped at Authentication by MFA and rate limiting
- Stolen token used for privilege escalation → stopped at Authorization by permission validation
- Database exfiltration after server compromise → stopped at Data by encryption at rest

Interactive elements:
- Click any ring to expand full mechanism list and STRIDE coverage
- "Remove Layer" buttons to simulate what happens when a layer is absent
- Click any attack arrow to see its full path and which layers would block it
- "Security Gap Finder" mode: highlight layers that do not address certain STRIDE categories

Color scheme: Rings from red (outer/perimeter) to blue (inner/data), with green for monitoring. Attack arrows in orange.

Responsive: Concentric rings scale proportionally to container width.
</details>

## API Security Design

APIs are both the primary interface that systems expose to consumers and one of the most significant attack surfaces in modern architectures. **API security design** addresses the specific vulnerabilities and protections relevant to API endpoints.

The OWASP API Security Top 10 (2023) identifies the most critical API security vulnerabilities. The architecturally most significant are:

- **Broken Object Level Authorization (BOLA):** An API endpoint returns data for any object ID without verifying that the requesting user is authorized to access that specific object. Example: `GET /api/patients/12345` returns patient data to any authenticated user, regardless of whether they have a relationship with patient 12345.
- **Broken Function Level Authorization:** API endpoints for administrative or privileged functions are accessible to regular users because authorization is checked at the object level only.
- **Excessive Data Exposure:** The API returns more fields than the caller needs, relying on the client to filter — a practice that leaks sensitive data to any client that examines the full response.
- **Unrestricted Resource Consumption:** APIs that accept user-defined query complexity (GraphQL, search APIs) without limits allow resource exhaustion attacks.
- **Security Misconfiguration:** Default credentials, verbose error messages, open CORS policies, missing security headers.

**ATAM security scenario:** A well-formed API security scenario for BOLA might be: "An authenticated user with role 'patient' requests the medical record for a patient ID that is not their own; the system returns an authorization error and logs the attempt, within 100ms." This scenario is testable and maps directly to an authorization architecture requirement.

## SIEM, Monitoring, and Incident Response

**Security Information and Event Management (SIEM)** is a system that aggregates, correlates, and analyzes security events from across the architecture — authentication events, access control decisions, network traffic anomalies, application errors, system logs — to detect attacks and policy violations in near-real-time.

SIEM architecture requires:

- **Log collection:** All security-relevant components must generate structured logs and ship them to a central aggregation system
- **Correlation rules:** Detection logic that identifies suspicious patterns (e.g., a user authenticating from two continents within 60 seconds)
- **Alerting:** Automated notification when correlation rules fire
- **Investigation support:** Query interfaces that enable analysts to trace the full history of a security event

**Intrusion Detection Systems (IDS)** provide real-time detection of attack patterns. Network IDS monitors network traffic; host IDS monitors system calls and file access patterns on individual hosts.

**Security incident response** is the organizational and architectural capability to contain and recover from successful attacks. Architecturally, incident response requires:

- **Isolation capability:** The ability to isolate compromised services or accounts without taking down the entire system
- **Forensic data:** Sufficient logging to reconstruct what happened, when, and how
- **Communication channels:** Out-of-band communication paths that remain available if the primary system is compromised
- **Recovery playbooks:** Tested procedures for restoring from known-good states

**ATAM security scenario:** "When the SIEM detects a credential compromise pattern (>10 failed logins from a new geolocation), the IAM system automatically locks the account and notifies the account owner via a secondary channel within 60 seconds." This scenario tests the integration of SIEM, IAM, and incident response — a system that has each component independently but no integration is at risk for this scenario.

## Least Privilege, Secure SDLC, and Privacy by Design

Three additional security architecture principles that ATAM evaluations must assess:

The **least privilege principle** states that every process, service, account, and user should be given only the minimum permissions required for its legitimate function — nothing more. Violations of least privilege are a common root cause of security incidents: a compromised service with excessive permissions can access data and systems beyond its intended scope, amplifying the blast radius of the compromise.

In microservices architectures, least privilege is implemented through service-specific IAM roles (each service gets a role with only the permissions it needs), network policies (services can only communicate with services they legitimately depend on), and fine-grained database permissions (each service's database user can only access that service's schema).

The **Secure Development Lifecycle (SDLC)** integrates security practices into every phase of development: threat modeling during design, security code review during implementation, static application security testing (SAST) and dynamic application security testing (DAST) during CI/CD, and penetration testing before and after production deployment. **Penetration testing** (authorized simulated attack) provides empirical evidence that security controls work as intended — complementing the architectural analysis that ATAM provides.

**Privacy by Design** is the principle that privacy protections are built into the system's architecture from the start, rather than added as features afterward. Architecturally, Privacy by Design produces: data minimization (collect only the data actually needed), purpose limitation (data used only for the purpose it was collected for), storage limitation (data retained only as long as necessary), and access controls that enforce data subject rights (GDPR right to access, right to erasure).

!!! mascot-tip "Security Scenarios Must Specify the Attacker"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Vista giving a tip">
    Vista's pro tip for security scenario development: always specify the **threat actor** in the stimulus source. "A request arrives at the API" is not a security scenario. "An external attacker with knowledge of the API structure but no valid credentials attempts to enumerate user account IDs" is a security scenario. The attacker specification matters because different threat actors have different capabilities (nation-state attackers vs. opportunistic script kiddies vs. malicious insiders), and the architectural controls you need for each are different. ATAM security scenarios that do not specify the threat actor cannot be meaningfully evaluated against the architecture.

!!! mascot-celebration "Security: Your ATAM Superpower's Strongest Shield!"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Vista celebrating">
    Magnificent work, fellow architects! You just loaded the complete security evaluation toolkit. You can threat model with STRIDE, evaluate defense-in-depth layers, assess authentication and authorization architectures, check encryption key management, evaluate API security against OWASP Top 10 concerns, and build security scenarios that are specific, measurable, and architecturally evaluable. Security is no longer a vague requirement to hand to a separate team — it is a quality attribute you can evaluate with the same rigor as performance and availability. That is the security ATAM superpower, and it is now yours.

## Key Takeaways

Security architecture evaluation in ATAM requires specific vocabulary and methodology:

- **Security sub-properties** (confidentiality, integrity, availability, non-repudiation, auditability) map directly to scenario components and utility tree branches
- **STRIDE** classifies threats into Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege — providing a structured checklist for threat modeling
- **Attack surface reduction** eliminates threats by removing unnecessary exposure; **defense in depth** applies multiple independent control layers
- **Zero Trust** requires authentication and authorization for every access request, internal or external, with mutual TLS as the service-to-service identity mechanism
- **OAuth 2.0** is the standard delegated authorization protocol; Authorization Code Flow with PKCE is the secure pattern for user-facing applications
- **Encryption in transit** (TLS) and **encryption at rest** address different attack vectors; **key management** is the most critical and often the most overlooked aspect
- **Secret management** systems (Vault, AWS Secrets Manager) eliminate the common high-severity risk of secrets in code or configuration files
- **Least privilege** limits blast radius by ensuring compromised components have minimal permissions beyond their legitimate function
- **SIEM and IDS** are the detection layer — essential for scenarios requiring detection and response within defined time windows
- **Security scenarios** must specify the threat actor, the attack vector, the environment, the target artifact, and the required response with a quantitative measure — "the system must be secure" is never acceptable as a scenario

??? question "Self-Check: Security Architecture — Click to Reveal Answers"
    **Q1:** Apply STRIDE to the following architectural decision: "Internal microservices communicate over HTTP without TLS, since they are on the same private network." Identify at least three specific threats this creates.

    **Answer:** Three STRIDE threats: (1) **Tampering:** Any attacker who gains access to the private network (through compromised host, misconfigured network policy, supply chain attack) can intercept and modify inter-service HTTP messages without detection — modifying transaction amounts, user data, or commands. (2) **Information Disclosure:** All inter-service communication travels in plaintext. A compromised host with network capture capability can read all communication on the network segment — including authentication tokens, personal data, and business-sensitive information. (3) **Spoofing:** Without mTLS, there is no mutual authentication between services. A compromised service or a new unauthorized service can impersonate any other service on the network. The "private network" assumption is dangerous in cloud environments where network isolation is provided by software-defined networking — which is itself subject to misconfiguration. The mitigation for all three threats is mutual TLS (mTLS) for all service-to-service communication, which provides both encryption and mutual authentication simultaneously.

    ---

    **Q2:** A (H,H) security scenario states: "All patient health information (PHI) access must be logged within 50ms of the access event, with the user ID, timestamp, resource accessed, and action performed, to a tamper-evident audit log." An architectural review reveals that the audit logging is done asynchronously by the application and written to a regular database table. What security sub-properties and risk findings does this raise?

    **Answer:** Two issues: (1) **Auditability risk:** The 50ms response measure requires synchronous logging before the response is returned. Asynchronous logging means there is a window where PHI has been accessed but not yet logged — if the application crashes or the logging service is unavailable during that window, the access record is lost. This violates the audit requirement. (2) **Non-repudiation risk:** A regular database table is not tamper-evident — an attacker (or malicious insider) who gains database write access can modify or delete audit records, defeating the audit's purpose. The mitigation requires synchronous write to a tamper-evident audit store before the PHI response is returned. Tamper-evident options include: append-only log services (AWS CloudTrail, GCP Cloud Audit Logs), write-once storage (S3 Object Lock with compliance mode), or a cryptographic audit log (each entry includes a hash of the previous entry, making modification detectable). This is an architectural risk with severity H (HIPAA compliance requires complete, unmodified audit trails).

    ---

    **Q3:** An architecture team argues that their system is secure because "we have OAuth 2.0." An ATAM evaluator probes further. What specific questions would you ask to determine whether "we have OAuth 2.0" constitutes a security non-risk or a security risk?

    **Answer:** "We have OAuth 2.0" is not a security finding — it is the beginning of an investigation. Specific questions: (1) Which OAuth 2.0 flows are used, and are they appropriate for the client types? (Authorization Code + PKCE for browser clients? Client Credentials for service-to-service? Implicit flow, which is deprecated and insecure, should never be used.) (2) Where are access tokens stored on clients? (LocalStorage is vulnerable to XSS; HttpOnly Secure cookies are safer for browser applications.) (3) What is the token lifetime? (Short-lived tokens limit blast radius from token theft.) (4) Is token revocation supported, and how quickly do resource servers reflect revoked tokens? (5) Is scope enforcement implemented — do access tokens have specific, limited scopes, or are they broad enough to access everything? (6) Is the authorization server validating the audience (aud) claim — preventing a token issued for one service from being used at another? Each of these is a potential sensitivity point or risk for security scenarios involving credential theft, session hijacking, or privilege escalation.
