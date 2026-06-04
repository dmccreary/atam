# References: Security Architecture

Curated sources for deeper study of threat modeling, STRIDE, zero trust, authentication and authorization, encryption, SIEM, least privilege, and security scenario development for ATAM evaluations.

## Books

- **Anderson, Ross. (2020). *Security Engineering: A Guide to Building Dependable Distributed Systems* (3rd ed.). Wiley.** The most comprehensive security architecture reference, covering threat modeling, cryptographic protocols, access control, and defense-in-depth principles that map directly to the ATAM security tactic catalog in this chapter.

- **Shostack, Adam. (2014). *Threat Modeling: Designing for Security*. Wiley.** The definitive guide to STRIDE threat modeling, attack surface analysis, and structured threat identification — the primary methodology used in this chapter for security scenario development in ATAM evaluations.

- **Viega, John, and Gary McGraw. (2002). *Building Secure Software: How to Avoid Security Problems the Right Way*. Addison-Wesley.** Foundational treatment of security in the software development lifecycle, covering secure design principles, least privilege, defense in depth, and security testing methods referenced in this chapter.

## Articles and Papers

- **OWASP Foundation. (2023). "OWASP API Security Top 10." *Open Web Application Security Project*. https://owasp.org/API-Security/** The authoritative reference for API security vulnerabilities including BOLA, broken function-level authorization, and excessive data exposure — the vulnerabilities analyzed in this chapter's API security design section.

- **NIST. (2020). "Zero Trust Architecture." *NIST Special Publication 800-207*. https://doi.org/10.6028/NIST.SP.800-207** The definitive NIST standard for zero trust architecture, defining the "never trust, always verify" principles, mutual TLS requirements, and microsegmentation approaches evaluated in this chapter's zero trust analysis.

## Online Resources

- **"OWASP Top Ten." Open Web Application Security Project. https://owasp.org/www-project-top-ten/** OWASP's canonical list of web application security risks, providing the vulnerability taxonomy that underlies API security design analysis and ATAM security scenario construction in this chapter.

- **"Zero Trust Security Model." National Institute of Standards and Technology. https://www.nist.gov/publications/zero-trust-architecture** NIST's resources on zero trust implementation, covering the architectural components (identity providers, policy engines, resource servers) examined in this chapter's evaluation framework.

- **"OAuth 2.0." Internet Engineering Task Force (IETF). https://oauth.net/2/** The comprehensive OAuth 2.0 resource covering Authorization Code Flow, PKCE, Client Credentials, token management, and scope enforcement — the protocol analyzed in detail in this chapter's authentication architecture section.

- **"HashiCorp Vault Documentation." HashiCorp. https://developer.hashicorp.com/vault/docs** Official documentation for Vault secret management architecture, including dynamic secrets, access policies, and audit logging — directly relevant to this chapter's secret management analysis and risk identification.

## Videos

- **"STRIDE Threat Modeling." Adam Shostack. YouTube.** Adam Shostack's walkthrough of the STRIDE framework applied to software data flow diagrams, providing the hands-on threat modeling methodology introduced in this chapter's security architecture analysis.
