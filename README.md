# Basm data generator

A test data generator for generating moves into book a secure move

## Setup and run
Create an .env file with the required credentials for book a secure move and the name of the 'to prison' e.g. lincoln_hmp for generated moves:

```
BASM_CLIENT_ID=<value>
BASM_CLIENT_SECRET=<value>
BASM_API_URL=<value>
BASM_TO_PRISON=<value>
AUTH_CLIENT_ID=<value>
AUTH_CLIENT_SECRET=<value>
AUTH_API_URL=<value>
PRISONER_SEARCH_URL=<value>
```

run `npm start` to create the following moves:

- A move from prison
- A move from a police custody suite
- A move from court

## Scenarios

### ✅ No Identifiers (Done)
- **From Location**: Court or Police Custody Suite
- **Name and DOB**: Random
- **Prison Number**: N/A
- **PNC**: N/A
- **Automation**: N/A

Arrival has no PNC or prison number, doesn’t match any record in nomis

If there are no identifiers provided by BASM then we make the users search for new records
This is simply a new BASM record without prison number and PNC

### ✅ PNC Only - Unmatched (Done)
- **From Location**: Court or Police Custody Suite
- **Name and DOB**: Random
- **Prison Number**: N/A
- **PNC**: Matches with Nomis Record
- **Automation**: Validates the PNC matches a Nomis record and provides information on how to resolve if it doesn't

Arrival has unique pnc number, doesn’t match any record in nomis

We are assuming that people in this case are new prisoners.

### ✅ Court Return (Done)
- **From Location**: Court
- **Name and DOB**: Random
- **Prison Number**: Matches with Nomis Record (will always match)
- **PNC**: N/A
- **Automation**:
  - Loops through a predefined list of Existing Prison Numbers to find an Active Record
  - Warns if record is not OUT or last movement type was not Court (CRT) - can't currently complete the booking in these states but can still be viewed

Arrival has a PNC or prison number matching existing active prison record

Can't automate court return out but can validate that they are in the correct state and create the arrival for them.


### ✅ Is single match (Done)
- **From Location**: Police Custody Suite or Court
- **Name and DOB**: Matches with Nomis Record
- **Prison Number**: Matches with Nomis Record
- **PNC**: Matches with Nomis Record
- **Automation**:
  - Loops through a predefined list of Existing Prison Numbers to find and INACTIVE OUT record. Logs an error if non exists

### ❌ Is current booking from Police Custody Suite (Work in Progress)
- **From Location**: Police Custody Suite

Arrival has a PNC or prison number matching existing active prison record

Easy to generate as just need to create an arrival from PCS linked to any active prisoner,
Could validate that they are an “in prisoner”.

Bit of an edge case - an example is absconding from temporary absence

### ❌ Is multiple match (Work in Progress)
- **From Location**: Police Custody Suite or Court

Arrival matching multiple existing inactive prison record

### ❌ Is Unexpected Arrival (Work in Progress)
We show search results and allow user to create new record if necessary

No data generation needed for this

### ❌ Is Transfer (Work in Progress)
No BASM Arrival
Active prison record, with a scheduled move in to a specific prison

Validate prisoner is out, transfer out if required, and then transfer in.

### ❌ Is Temporary Absence (Work in Progress)
No BASM Arrival

We just require user to confirm arrival

No BASM data generated - requires a person to be currently on temporary absence

This can't be automated - but could validate? But not a lot of point adding
