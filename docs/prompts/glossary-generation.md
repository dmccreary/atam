# Generating a Glossary of Terms

I used Claude Code and the following prompt.

!!! prompt
    Please generate a glossary of terms for this textbook.
    Go through all the markdown files in the /docs directory.
    For each document, identify any technical terms that should be clearly defined.
    Place all the terms sorted alphabetically in the glossary.md file.
    Place each term in a markdown level 4 header.
    Create ISO 11179 metadata registry definitions for each term where each
    definition is:

    A term definition is considered to be consistent with ISO metadata registry guideline 11179 if it meets the following criteria:

    1. Precise
    2. Concise
    3. Distinct
    4. Non-circular
    5. Unencumbered with business rules

    After each term, place an example of how this term is used in the textbook using the **Example:** format.