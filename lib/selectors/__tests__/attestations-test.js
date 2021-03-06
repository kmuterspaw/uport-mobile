// Copyright (C) 2018 ConsenSys AG
//
// This file is part of uPort Mobile App.
//
// uPort Mobile App is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// uPort Mobile App is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with uPort Mobile App.  If not, see <http://www.gnu.org/licenses/>.
//
import uportReducer from 'uPortMobile/lib/reducers/uportReducer'
import { storeIdentity } from 'uPortMobile/lib/actions/uportActions'
import {
  attestationLedger,
  onlyLatestAttestations,
  requestedClaims,
  attestationSummary,
  allClaims,
  verifiedClaims,
  verifiedClaimsTokens,
  verifiedClaimsByType,
  verifiedClaimsByClaim,
  thirdPartyAttestationSummary,
  attestationsForTypeAndValue,
  attestationsIssuedBy,
  pendingAttestationFor,
  pendingAttestations,
  pendingOrIssuedAttestationFor,
  attestationsForIssuerAndType,
  onlyPendingAndLatestAttestations
} from 'uPortMobile/lib/selectors/attestations'
import { toJs, toClj, assocIn } from 'mori'

const simpleIdentity = {
  address: '0x9df0e9759b17f34e9123adbe6d3f25d54b72ad6a',
  own: {
    name: 'Alice',
    phone: '555-555-5555',
    description: 'UX Designer',
    connections: {
      knows: ['0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01']
    }
  },
  attestations: {
    '0011': {
      iss: '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01',
      exp: 1,
      claim: {
        name: 'Alice'
      },
      token: '0011.TOKEN'
    },
    '0015': {
      iss: '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01',
      exp: 2,
      claim: {
        name: 'Alice'
      },
      token: '0015.TOKEN'
    },
    '0012': {
      iss: '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc02',
      claim: {
        name: 'Alice'
      },
      token: '0011.TOKEN'
    },
    '0013': {
      iss: '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01',
      claim: {
        phone: '555-555-5555'
      },
      token: '0013.TOKEN'
    },
    '0014': {
      iss: '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01',
      claim: {
        nationalId: 'xxx0xxxx0xxx'
      },
      token: '0014.TOKEN'
    }
  },
  pendingAttestations: {
    '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01': {
      nationalId: {applicant_id: 1234},
      name: {}
    },
    '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc02': {
      nationalId: {}
    }

  }
}

const withIssuers = toClj({
  external: {
    '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01': {
      name: 'Issuer 1'
    },
    '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc02': {
      name: 'Issuer 2'
    }
  }
})
const uport = uportReducer(withIssuers, storeIdentity(simpleIdentity))
const withIdentity = {uport}

const otherIdentity = {
  network: 'kovan',
  address: '34ukSmiK1oA1C5Du8aWpkjFGALoH7nsHeDX',
  own: {
    name: 'Alice Kovan',
    phone: '555-555-5555'
  },
  attestations: {
    '0020': {
      iss: '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01',
      claim: {
        phone: '555-555-5555'
      },
      token: '0013.TOKEN'
    },
    '0021': {
      iss: '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01',
      claim: {
        nationalId: 'xxx0xxxx0xxx'
      },
      token: '0014.TOKEN'
    }
  }
}

const withMultipleIdentities = {
  uport: uportReducer(uport, storeIdentity(otherIdentity))
}

it('returns full ledger', () => {
  expect(attestationLedger({})).toMatchSnapshot()
  expect(toJs(attestationLedger(withIdentity))).toMatchSnapshot()
  expect(toJs(attestationLedger(withMultipleIdentities))).toMatchSnapshot()
})

it('returns ledger with only the latest attestations', () => {
  expect(onlyLatestAttestations({})).toMatchSnapshot()
  expect(toJs(onlyLatestAttestations(withIdentity))).toMatchSnapshot()
  expect(toJs(onlyLatestAttestations(withMultipleIdentities))).toMatchSnapshot()
})

it('returns third party attestations summary', () => {
  expect(toJs(thirdPartyAttestationSummary(withIdentity))).toMatchSnapshot()
  expect(toJs(thirdPartyAttestationSummary(withMultipleIdentities))).toMatchSnapshot()
})

it('returns full attestations summary', () => {
  expect(attestationSummary(withIdentity)).toMatchSnapshot()
  expect(attestationSummary(withMultipleIdentities)).toMatchSnapshot()
})

it('returns allClaims', () => {
  expect(toJs(allClaims(withIdentity))).toMatchSnapshot()
  expect(toJs(allClaims(withMultipleIdentities))).toMatchSnapshot()
})

it('returns requestedClaims', () => {
  expect(toJs(requestedClaims(withIdentity, []))).toMatchSnapshot()
  expect(toJs(requestedClaims(withIdentity, ['name']))).toMatchSnapshot()
  expect(toJs(requestedClaims(withIdentity, ['name', 'nationalId', 'nonexisting']))).toMatchSnapshot()

  expect(toJs(requestedClaims(withMultipleIdentities, []))).toMatchSnapshot()
  expect(toJs(requestedClaims(withMultipleIdentities, ['name']))).toMatchSnapshot()
  expect(toJs(requestedClaims(withMultipleIdentities, ['name', 'nationalId', 'nonexisting']))).toMatchSnapshot()
})

it('returns verifiedClaims', () => {
  expect(toJs(verifiedClaims(withIdentity, []))).toMatchSnapshot()
  expect(toJs(verifiedClaims(withIdentity, ['name']))).toMatchSnapshot()
  expect(toJs(verifiedClaims(withIdentity, ['name', 'nationalId', 'nonexisting']))).toMatchSnapshot()

  expect(toJs(verifiedClaims(withMultipleIdentities, []))).toMatchSnapshot()
  expect(toJs(verifiedClaims(withMultipleIdentities, ['name']))).toMatchSnapshot()
  expect(toJs(verifiedClaims(withMultipleIdentities, ['name', 'nationalId', 'nonexisting']))).toMatchSnapshot()
})

it('returns verifiedClaimsTokens', () => {
  expect(toJs(verifiedClaimsTokens(withIdentity, []))).toMatchSnapshot()
  expect(toJs(verifiedClaimsTokens(withIdentity, ['name']))).toMatchSnapshot()
  expect(toJs(verifiedClaimsTokens(withIdentity, ['name', 'nationalId', 'nonexisting']))).toMatchSnapshot()

  expect(toJs(verifiedClaimsTokens(withMultipleIdentities, []))).toMatchSnapshot()
  expect(toJs(verifiedClaimsTokens(withMultipleIdentities, ['name']))).toMatchSnapshot()
  expect(toJs(verifiedClaimsTokens(withMultipleIdentities, ['name', 'nationalId', 'nonexisting']))).toMatchSnapshot()
})

it('returns verifiedClaimsByClaim', () => {
  expect(toJs(verifiedClaimsByClaim(withIdentity, []))).toMatchSnapshot()
  expect(toJs(verifiedClaimsByClaim(withIdentity, ['name']))).toMatchSnapshot()
  expect(toJs(verifiedClaimsByClaim(withIdentity, ['name', 'nationalId', 'nonexisting']))).toMatchSnapshot()

  expect(toJs(verifiedClaimsByClaim(withMultipleIdentities, []))).toMatchSnapshot()
  expect(toJs(verifiedClaimsByClaim(withMultipleIdentities, ['name']))).toMatchSnapshot()
  expect(toJs(verifiedClaimsByClaim(withMultipleIdentities, ['name', 'nationalId', 'nonexisting']))).toMatchSnapshot()
})

it('returns verifiedClaimsByType', () => {
  expect(toJs(verifiedClaimsByType(withIdentity, []))).toMatchSnapshot()
  expect(toJs(verifiedClaimsByType(withIdentity, ['name']))).toMatchSnapshot()
  expect(toJs(verifiedClaimsByType(withIdentity, ['name', 'nationalId', 'nonexisting']))).toMatchSnapshot()

  expect(toJs(verifiedClaimsByType(withMultipleIdentities, []))).toMatchSnapshot()
  expect(toJs(verifiedClaimsByType(withMultipleIdentities, ['name']))).toMatchSnapshot()
  expect(toJs(verifiedClaimsByType(withMultipleIdentities, ['name', 'nationalId', 'nonexisting']))).toMatchSnapshot()
})

it('returns all attestations matching a claim type and name', () => {
  expect(attestationsForTypeAndValue(withIdentity, {claimType: 'name', claimValue: 'Alice'})).toMatchSnapshot()
  expect(attestationsForTypeAndValue(withIdentity, {claimType: 'name', claimValue: 'Alice'})).toHaveLength(2)
  expect(attestationsForTypeAndValue(withIdentity, {claimType: 'name', claimValue: 'Bob'})).toHaveLength(0)

  expect(attestationsForTypeAndValue(withMultipleIdentities, {claimType: 'name', claimValue: 'Alice'})).toMatchSnapshot()
  expect(attestationsForTypeAndValue(withMultipleIdentities, {claimType: 'name', claimValue: 'Alice'})).toHaveLength(0)
  expect(attestationsForTypeAndValue(withMultipleIdentities, {claimType: 'name', claimValue: 'Bob'})).toHaveLength(0)
})

it('returns all attestations issued by someone', () => {
  expect(attestationsIssuedBy(withIdentity, {issuer: '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01'})).toMatchSnapshot()
  expect(attestationsIssuedBy(withIdentity, {issuer: '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01'})).toHaveLength(4)
  expect(attestationsIssuedBy(withIdentity, {issuer: '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc02'})).toHaveLength(1)

  expect(attestationsIssuedBy(withMultipleIdentities, {issuer: '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01'})).toMatchSnapshot()
  expect(attestationsIssuedBy(withMultipleIdentities, {issuer: '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01'})).toHaveLength(2)
  expect(attestationsIssuedBy(withMultipleIdentities, {issuer: '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc02'})).toHaveLength(0)
})

it('returns all pendingAttestations', () => {
  expect(toJs(pendingAttestations(withIdentity))).toMatchSnapshot()
  expect(toJs(pendingAttestations(withMultipleIdentities))).toMatchSnapshot()
})

it('returns all onlyPendingAndLatestAttestations', () => {
  expect(onlyPendingAndLatestAttestations(withIdentity)).toMatchSnapshot()
  expect(onlyPendingAndLatestAttestations(withMultipleIdentities)).toMatchSnapshot()
})

it('returns pendingAttestation for issuer and type', () => {
  expect(pendingAttestationFor(withIdentity, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'nationalId')).toMatchSnapshot()
  expect(pendingAttestationFor(withMultipleIdentities, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'name')).toMatchSnapshot()
  expect(pendingAttestationFor(withMultipleIdentities, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'email')).toEqual(undefined)
})

it('returns pendingOrIssuedAttestationFor for issuer and type', () => {
  expect(pendingOrIssuedAttestationFor(withIdentity, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'nationalId')).toEqual(true)
  expect(pendingOrIssuedAttestationFor(withIdentity, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc02', 'nationalId')).toEqual(true)
  expect(pendingOrIssuedAttestationFor(withIdentity, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'name')).toEqual(true)
  expect(pendingOrIssuedAttestationFor(withMultipleIdentities, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'name')).toEqual(false)
  expect(pendingOrIssuedAttestationFor(withMultipleIdentities, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'email')).toEqual(false)
  expect(pendingOrIssuedAttestationFor(withMultipleIdentities, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'phone')).toEqual(true)
})

it('returns attestations for issuer and type', () => {
  expect(toJs(attestationsForIssuerAndType(withIdentity, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'nationalId'))).toEqual([{'claim': {'nationalId': 'xxx0xxxx0xxx'}, 'iss': '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'token': '0014.TOKEN'}])
  expect(toJs(attestationsForIssuerAndType(withIdentity, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'name'))).toEqual([{'claim': {'name': 'Alice'}, 'exp': 2, 'iss': '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'token': '0015.TOKEN'}])
  expect(toJs(attestationsForIssuerAndType(withMultipleIdentities, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'name'))).toEqual([])
  expect(toJs(attestationsForIssuerAndType(withMultipleIdentities, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'email'))).toEqual([])
  expect(toJs(attestationsForIssuerAndType(withMultipleIdentities, '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'phone'))).toEqual([{'claim': {'phone': '555-555-5555'}, 'iss': '0x1bc5cbf71b068642fc5e89c5e3d0bdb3e366bc01', 'token': '0013.TOKEN'}])
})
