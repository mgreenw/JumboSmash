## Complete Profile

Test the completing of a profile, assuming someone has already gone
through the on-boarding process. This request submits the bio and birthday
information.

### Test 1

**Test Client**: jmeter
**Test Config**: TestUserProfileCompletion.jmx
**Users** : 700
**Ramp up** : 10sec
**Network** : 74 Brom
**Stack** : Standard

**Results**:
file: jmeter_client/CompleteProfileTest_700_10.csv


### Test 2

**Test Client**: jmeter
**Test Config**: TestUserProfileCompletion.jmx
**Users** : 300
**Ramp up** : 2sec
**Network** : 74 Brom
**Stack** : Standard

**Results**:
file: jmeter_client/CompleteProfileTest_300_2.csv


### Test 3

**Test Client**: jmeter
**Test Config**: TestUserProfileCompletion.jmx
**Users** : 300
**Ramp up** : 20sec
**Network** : 74 Brom
**Stack** : Standard

**Results**:
file: jmeter_client/CompleteProfileTest_700_20.csv



## Get Candidates

Test the completion of the get_candidates endpoint.

### Test 1

**Test Client**: jmeter
**Test Config**: TestGetCandidates.jmx
**Users** : 700
**Ramp up** : 10sec
**Loops** : 20
**Network** : 64 Chet
**Stack** :
  - 2 traefik proxies

**Results**:
file: jmeter_client/1_GetCandidates_700_10_20.csv


### Test 2

**Test Client**: jmeter
**Test Config**: TestGetCandidates.jmx
**Users** : 700
**Ramp up** : 10sec
**Loops** : 20
**Network** : 64 Chet
**Stack** :
  - 2 traefik proxies
  - 4 server instances

**Results**:
file: jmeter_client/2_GetCandidates_700_10_20.csv

Surprisingly, the added servers seem to effect latency in a negative way,
this likely means that the bottleneck is not with server processing,
and that adding servers might produce undesirable overhead.
