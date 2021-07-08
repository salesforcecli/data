/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { FieldType } from '../../src/dataSoqlQueryTypes';
import { makeSubfield, queryFieldsExemplars } from './queryFields.exemplars';

export const soqlQueryExemplars = {
  simpleQuery: {
    query: 'SELECT id, name FROM Contact',
    queryResult: {
      totalSize: 1,
      done: true,
      records: [
        {
          attributes: {
            type: 'Contact',
            url: '/services/data/v51.0/sobjects/Contact/003B000000DkDswIAF',
          },
          Id: '003B000000DkDswIAF',
          Name: 'Matteo Crippa',
        },
      ],
    },
    soqlQueryResult: {
      columns: queryFieldsExemplars.simpleQuery.columns,
      query: 'SELECT id, name FROM Contact',
      result: {
        totalSize: 1,
        done: true,
        records: [
          {
            attributes: {
              type: 'Contact',
              url: '/services/data/v51.0/sobjects/Contact/003B000000DkDswIAF',
            },
            Id: '003B000000DkDswIAF',
            Name: 'Matteo Crippa',
          },
        ],
      },
    },
  },
  subQuery: {
    query: 'SELECT Name, ( SELECT LastName FROM Contacts ) FROM Account',
    queryResult: {
      totalSize: 50,
      done: true,
      records: [
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000002Gcp0IAC',
          },
          Name: 'Cisco Systems, Inc.',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003niSMIAY',
          },
          Name: 'ASSMANN Electronic GmbH',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003nwhxIAA',
          },
          Name: 'Young Brothers Tae Kwon Do - Dupe',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003nwhyIAA',
          },
          Name: 'None',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003nwhzIAA',
          },
          Name: 'PASONA INC.',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003nwi0IAA',
          },
          Name: 'Harada20150427',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003nwi1IAA',
          },
          Name: 'Zensoft services',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001T0000007AkXYIA0',
          },
          Name: 'GenePoint',
          Contacts: {
            totalSize: 1,
            done: true,
            records: [
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsABIAZ',
                },
                LastName: 'Frank',
              },
            ],
          },
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001T0000007AkXZIA0',
          },
          Name: 'United Oil & Gas, UK',
          Contacts: {
            totalSize: 1,
            done: true,
            records: [
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA8IAJ',
                },
                LastName: 'James',
              },
            ],
          },
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001T0000007AkXaIAK',
          },
          Name: 'United Oil & Gas, Singapore',
          Contacts: {
            totalSize: 2,
            done: true,
            records: [
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA9IAJ',
                },
                LastName: 'Ripley',
              },
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsAAIAZ',
                },
                LastName: "D'Cruz",
              },
            ],
          },
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001T0000007AkXbIAK',
          },
          Name: 'Edge Communications',
          Contacts: {
            totalSize: 2,
            done: true,
            records: [
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9vIAB',
                },
                LastName: 'Gonzalez',
              },
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9wIAB',
                },
                LastName: 'Forbes',
              },
            ],
          },
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001T0000007AkXcIAK',
          },
          Name: 'Burlington Textiles Corp of America',
          Contacts: {
            totalSize: 1,
            done: true,
            records: [
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9xIAB',
                },
                LastName: 'Rogers',
              },
            ],
          },
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001T0000007AkXdIAK',
          },
          Name: 'Pyramid Construction Inc.',
          Contacts: {
            totalSize: 1,
            done: true,
            records: [
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9yIAB',
                },
                LastName: 'Stumuller',
              },
            ],
          },
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001T0000007AkXeIAK',
          },
          Name: 'Dickenson plc',
          Contacts: {
            totalSize: 1,
            done: true,
            records: [
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9zIAB',
                },
                LastName: 'Young',
              },
            ],
          },
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001T0000007AkXfIAK',
          },
          Name: 'Grand Hotels & Resorts Ltd',
          Contacts: {
            totalSize: 2,
            done: true,
            records: [
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA0IAJ',
                },
                LastName: 'Barr',
              },
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA1IAJ',
                },
                LastName: 'Bond',
              },
            ],
          },
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003nwi2IAA',
          },
          Name: 'EDD',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003nwlHIAQ',
          },
          Name: 'Kurt Salmon Germany GmbH',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003nwtOIAQ',
          },
          Name: 'AIG New Zealand',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003o1r3IAA',
          },
          Name: 'PERSOL HOLDINGS CO., LTD.',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003o1sWIAQ',
          },
          Name: 'Cognizant Technology Solutions',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003o1sXIAQ',
          },
          Name: 'CRITEO SA (SRM)',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003o1slIAA',
          },
          Name: 'Faith Church of Grayslake',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B00000046jfmIAA',
          },
          Name: 'AWコンピュータ',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003pqcsIAA',
          },
          Name: 'Event-Crew Australia',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B00000046jg1IAA',
          },
          Name: 'Carbonadi',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B00000046jg2IAA',
          },
          Name: 'Grupo Patio',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B00000046jfnIAA',
          },
          Name: 'Visionary Enterprises, Inc.',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000003pqdOIAQ',
          },
          Name: 'Mandalay Homes',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B00000046jg3IAA',
          },
          Name: 'PE Alex Grekov',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B00000046jg4IAA',
          },
          Name: 'time inc',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B00000046jg5IAA',
          },
          Name: 'PROTO SOLUTION',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001T0000007AkXgIAK',
          },
          Name: 'Express Logistics and Transport',
          Contacts: {
            totalSize: 2,
            done: true,
            records: [
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA4IAJ',
                },
                LastName: 'Levy',
              },
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA5IAJ',
                },
                LastName: 'Davis',
              },
            ],
          },
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001T0000007AkXhIAK',
          },
          Name: 'University of Arizona',
          Contacts: {
            totalSize: 1,
            done: true,
            records: [
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA6IAJ',
                },
                LastName: 'Grey',
              },
            ],
          },
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001T0000007AkXiIAK',
          },
          Name: 'United Oil & Gas Corp.',
          Contacts: {
            totalSize: 4,
            done: true,
            records: [
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA2IAJ',
                },
                LastName: 'Pavlova',
              },
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA3IAJ',
                },
                LastName: 'Boyle',
              },
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsACIAZ',
                },
                LastName: 'Green',
              },
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA7IAJ',
                },
                LastName: 'Song',
              },
            ],
          },
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001T0000007AkXjIAK',
          },
          Name: 'sForce',
          Contacts: {
            totalSize: 2,
            done: true,
            records: [
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsAEIAZ',
                },
                LastName: 'Llorrac',
              },
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003T000000FzsADIAZ',
                },
                LastName: 'Nedaerk',
              },
            ],
          },
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B0000002GchlIAC',
          },
          Name: 'ACME Laboratories',
          Contacts: {
            totalSize: 1,
            done: true,
            records: [
              {
                attributes: {
                  type: 'Contact',
                  url: '/services/data/v51.0/sobjects/Contact/003B0000003gFTfIAM',
                },
                LastName: 'Wang',
              },
            ],
          },
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcoQIAS',
          },
          Name: 'E & A WORLDWIDE TRADERS',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcoRIAS',
          },
          Name: 'Investec (Uk) Limited',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcoSIAS',
          },
          Name: 'UV Networks',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcoTIAS',
          },
          Name: 'M-Spectr',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcoUIAS',
          },
          Name: 'Slow Poke',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcoVIAS',
          },
          Name: 'Gas Natural S.A. ESP',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcoWIAS',
          },
          Name: 'Biddesk',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcoXIAS',
          },
          Name: 'The Clearing',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcoYIAS',
          },
          Name: 'Cherrytree Support Services',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcoZIAS',
          },
          Name: 'Stuart  Dean Co. Inc.',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcoaIAC',
          },
          Name: 'TAIWAN SHIN KONG SECURITY CO., LTD.',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcobIAC',
          },
          Name: 'Weller Truck Parts LLC',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcocIAC',
          },
          Name: 'GC Pizza Hut',
          Contacts: null,
        },
        {
          attributes: {
            type: 'Account',
            url: '/services/data/v51.0/sobjects/Account/001B000000rXcodIAC',
          },
          Name: 'Architectural Tile & Marble',
          Contacts: null,
        },
      ],
    },
    soqlQueryResult: {
      query: 'SELECT Name, ( SELECT LastName FROM Contacts ) FROM Account',
      columns: queryFieldsExemplars.subquery.columns,
      result: {
        totalSize: 50,
        done: true,
        records: [
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000002Gcp0IAC',
            },
            Name: 'Cisco Systems, Inc.',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003niSMIAY',
            },
            Name: 'ASSMANN Electronic GmbH',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwhxIAA',
            },
            Name: 'Young Brothers Tae Kwon Do - Dupe',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwhyIAA',
            },
            Name: 'None',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwhzIAA',
            },
            Name: 'PASONA INC.',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwi0IAA',
            },
            Name: 'Harada20150427',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwi1IAA',
            },
            Name: 'Zensoft services',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXYIA0',
            },
            Name: 'GenePoint',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsABIAZ',
                  },
                  LastName: 'Frank',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXZIA0',
            },
            Name: 'United Oil & Gas, UK',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA8IAJ',
                  },
                  LastName: 'James',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXaIAK',
            },
            Name: 'United Oil & Gas, Singapore',
            Contacts: {
              totalSize: 2,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA9IAJ',
                  },
                  LastName: 'Ripley',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsAAIAZ',
                  },
                  LastName: "D'Cruz",
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXbIAK',
            },
            Name: 'Edge Communications',
            Contacts: {
              totalSize: 2,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9vIAB',
                  },
                  LastName: 'Gonzalez',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9wIAB',
                  },
                  LastName: 'Forbes',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXcIAK',
            },
            Name: 'Burlington Textiles Corp of America',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9xIAB',
                  },
                  LastName: 'Rogers',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXdIAK',
            },
            Name: 'Pyramid Construction Inc.',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9yIAB',
                  },
                  LastName: 'Stumuller',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXeIAK',
            },
            Name: 'Dickenson plc',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9zIAB',
                  },
                  LastName: 'Young',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXfIAK',
            },
            Name: 'Grand Hotels & Resorts Ltd',
            Contacts: {
              totalSize: 2,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA0IAJ',
                  },
                  LastName: 'Barr',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA1IAJ',
                  },
                  LastName: 'Bond',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwi2IAA',
            },
            Name: 'EDD',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwlHIAQ',
            },
            Name: 'Kurt Salmon Germany GmbH',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwtOIAQ',
            },
            Name: 'AIG New Zealand',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003o1r3IAA',
            },
            Name: 'PERSOL HOLDINGS CO., LTD.',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003o1sWIAQ',
            },
            Name: 'Cognizant Technology Solutions',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003o1sXIAQ',
            },
            Name: 'CRITEO SA (SRM)',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003o1slIAA',
            },
            Name: 'Faith Church of Grayslake',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jfmIAA',
            },
            Name: 'AWコンピュータ',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003pqcsIAA',
            },
            Name: 'Event-Crew Australia',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jg1IAA',
            },
            Name: 'Carbonadi',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jg2IAA',
            },
            Name: 'Grupo Patio',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jfnIAA',
            },
            Name: 'Visionary Enterprises, Inc.',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003pqdOIAQ',
            },
            Name: 'Mandalay Homes',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jg3IAA',
            },
            Name: 'PE Alex Grekov',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jg4IAA',
            },
            Name: 'time inc',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jg5IAA',
            },
            Name: 'PROTO SOLUTION',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXgIAK',
            },
            Name: 'Express Logistics and Transport',
            Contacts: {
              totalSize: 2,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA4IAJ',
                  },
                  LastName: 'Levy',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA5IAJ',
                  },
                  LastName: 'Davis',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXhIAK',
            },
            Name: 'University of Arizona',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA6IAJ',
                  },
                  LastName: 'Grey',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXiIAK',
            },
            Name: 'United Oil & Gas Corp.',
            Contacts: {
              totalSize: 4,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA2IAJ',
                  },
                  LastName: 'Pavlova',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA3IAJ',
                  },
                  LastName: 'Boyle',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsACIAZ',
                  },
                  LastName: 'Green',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA7IAJ',
                  },
                  LastName: 'Song',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXjIAK',
            },
            Name: 'sForce',
            Contacts: {
              totalSize: 2,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsAEIAZ',
                  },
                  LastName: 'Llorrac',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsADIAZ',
                  },
                  LastName: 'Nedaerk',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000002GchlIAC',
            },
            Name: 'ACME Laboratories',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003B0000003gFTfIAM',
                  },
                  LastName: 'Wang',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoQIAS',
            },
            Name: 'E & A WORLDWIDE TRADERS',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoRIAS',
            },
            Name: 'Investec (Uk) Limited',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoSIAS',
            },
            Name: 'UV Networks',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoTIAS',
            },
            Name: 'M-Spectr',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoUIAS',
            },
            Name: 'Slow Poke',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoVIAS',
            },
            Name: 'Gas Natural S.A. ESP',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoWIAS',
            },
            Name: 'Biddesk',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoXIAS',
            },
            Name: 'The Clearing',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoYIAS',
            },
            Name: 'Cherrytree Support Services',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoZIAS',
            },
            Name: 'Stuart  Dean Co. Inc.',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoaIAC',
            },
            Name: 'TAIWAN SHIN KONG SECURITY CO., LTD.',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcobIAC',
            },
            Name: 'Weller Truck Parts LLC',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcocIAC',
            },
            Name: 'GC Pizza Hut',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcodIAC',
            },
            Name: 'Architectural Tile & Marble',
            Contacts: null,
          },
        ],
      },
    },
  },
  queryMore: {
    query: 'SELECT id, name FROM Contact',
    queryResult: {
      totalSize: 2,
      done: false,
      nextRecordsUrl: '/services/data/v51.0/query/01gB000003KL1aaIAD-1',
      records: [
        {
          attributes: {
            type: 'Contact',
            url: '/services/data/v51.0/sobjects/Contact/00390000001TdgeAAC',
          },
          Id: '00390000001TdgeAAC',
          Name: 'Caroline Roth',
        },
      ],
    },
    queryMoreResult: {
      totalSize: 2,
      done: true,
      records: [
        {
          attributes: {
            type: 'Contact',
            url: '/services/data/v51.0/sobjects/Contact/003B0000001U8uaIAC',
          },
          Id: '003B0000001U8uaIAC',
          Name: 'Dalil Djidel',
        },
      ],
    },
    soqlQueryResult: {
      query: 'SELECT id, name FROM Contact',
      columns: queryFieldsExemplars.simpleQuery.columns,
      result: {
        totalSize: 2,
        done: true,
        records: [
          {
            attributes: {
              type: 'Contact',
              url: '/services/data/v51.0/sobjects/Contact/00390000001TdgeAAC',
            },
            Id: '00390000001TdgeAAC',
            Name: 'Caroline Roth',
          },
          {
            attributes: {
              type: 'Contact',
              url: '/services/data/v51.0/sobjects/Contact/003B0000001U8uaIAC',
            },
            Id: '003B0000001U8uaIAC',
            Name: 'Dalil Djidel',
          },
        ],
      },
    },
  },
  emptyQuery: {
    queryResult: {
      totalSize: 0,
      done: true,
      records: [],
    },
    soqlQueryResult: {
      query: "SELECT Name FROM Contact where name = 'some nonexistent name'",
      columns: [],
      result: {
        totalSize: 0,
        done: true,
        records: [],
      },
    },
  },
  queryWithNullFields: {
    soqlQueryResult: {
      query: 'SELECT Name, Avg(AnnualRevenue) FROM Account GROUP BY Name',
      columns: [
        { fieldType: FieldType.field, name: 'Name' },
        { fieldType: FieldType.functionField, name: 'avg(AnnualRevenue)' },
      ],
      result: {
        totalSize: 16,
        done: true,
        records: [
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Sample Account for Entitlements',
            expr0: null,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'sForce',
            expr0: null,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'United Oil & Gas, Singapore',
            expr0: null,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Edge Communications',
            expr0: 139000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'University of Arizona',
            expr0: null,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'United Oil & Gas Corp.',
            expr0: 5600000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Pyramid Construction Inc.',
            expr0: 950000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Grand Hotels & Resorts Ltd',
            expr0: 500000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Dickenson plc',
            expr0: 50000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'baz',
            expr0: null,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Burlington Textiles Corp of America',
            expr0: 350000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'zzzzz',
            expr0: 10,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'United Oil & Gas, UK',
            expr0: null,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Express Logistics and Transport',
            expr0: 950000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'GenePoint',
            expr0: 30000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'foo',
            expr0: 100,
          },
        ],
      },
    },
  },
  subqueryAccountsAndContacts: {
    soqlQueryResult: {
      query: 'SELECT Name, ( SELECT LastName FROM Contacts ) FROM Account limit 50',
      columns: [
        { fieldType: FieldType.field, name: 'Name' },
        makeSubfield('Contacts', [{ fieldType: FieldType.field, name: 'LastName' }]),
      ],
      result: {
        totalSize: 50,
        done: true,
        records: [
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000002Gcp0IAC',
            },
            Name: 'Cisco Systems, Inc.',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003niSMIAY',
            },
            Name: 'ASSMANN Electronic GmbH',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwhxIAA',
            },
            Name: 'Young Brothers Tae Kwon Do - Dupe',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwhyIAA',
            },
            Name: 'None',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwhzIAA',
            },
            Name: 'PASONA INC.',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwi0IAA',
            },
            Name: 'Harada20150427',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwi1IAA',
            },
            Name: 'Zensoft services',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXYIA0',
            },
            Name: 'GenePoint',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsABIAZ',
                  },
                  LastName: 'Frank',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXZIA0',
            },
            Name: 'United Oil & Gas, UK',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA8IAJ',
                  },
                  LastName: 'James',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXaIAK',
            },
            Name: 'United Oil & Gas, Singapore',
            Contacts: {
              totalSize: 2,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA9IAJ',
                  },
                  LastName: 'Ripley',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsAAIAZ',
                  },
                  LastName: "D'Cruz",
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXbIAK',
            },
            Name: 'Edge Communications',
            Contacts: {
              totalSize: 2,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9vIAB',
                  },
                  LastName: 'Gonzalez',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9wIAB',
                  },
                  LastName: 'Forbes',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXcIAK',
            },
            Name: 'Burlington Textiles Corp of America',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9xIAB',
                  },
                  LastName: 'Rogers',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXdIAK',
            },
            Name: 'Pyramid Construction Inc.',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9yIAB',
                  },
                  LastName: 'Stumuller',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXeIAK',
            },
            Name: 'Dickenson plc',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000Fzs9zIAB',
                  },
                  LastName: 'Young',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXfIAK',
            },
            Name: 'Grand Hotels & Resorts Ltd',
            Contacts: {
              totalSize: 2,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA0IAJ',
                  },
                  LastName: 'Barr',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA1IAJ',
                  },
                  LastName: 'Bond',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwi2IAA',
            },
            Name: 'EDD',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwlHIAQ',
            },
            Name: 'Kurt Salmon Germany GmbH',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003nwtOIAQ',
            },
            Name: 'AIG New Zealand',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003o1r3IAA',
            },
            Name: 'PERSOL HOLDINGS CO., LTD.',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003o1sWIAQ',
            },
            Name: 'Cognizant Technology Solutions',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003o1sXIAQ',
            },
            Name: 'CRITEO SA (SRM)',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003o1slIAA',
            },
            Name: 'Faith Church of Grayslake',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jfmIAA',
            },
            Name: 'AWコンピュータ',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003pqcsIAA',
            },
            Name: 'Event-Crew Australia',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jg1IAA',
            },
            Name: 'Carbonadi',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jg2IAA',
            },
            Name: 'Grupo Patio',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jfnIAA',
            },
            Name: 'Visionary Enterprises, Inc.',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000003pqdOIAQ',
            },
            Name: 'Mandalay Homes',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jg3IAA',
            },
            Name: 'PE Alex Grekov',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jg4IAA',
            },
            Name: 'time inc',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B00000046jg5IAA',
            },
            Name: 'PROTO SOLUTION',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXgIAK',
            },
            Name: 'Express Logistics and Transport',
            Contacts: {
              totalSize: 2,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA4IAJ',
                  },
                  LastName: 'Levy',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA5IAJ',
                  },
                  LastName: 'Davis',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXhIAK',
            },
            Name: 'University of Arizona',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA6IAJ',
                  },
                  LastName: 'Grey',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXiIAK',
            },
            Name: 'United Oil & Gas Corp.',
            Contacts: {
              totalSize: 4,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA2IAJ',
                  },
                  LastName: 'Pavlova',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA3IAJ',
                  },
                  LastName: 'Boyle',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsACIAZ',
                  },
                  LastName: 'Green',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsA7IAJ',
                  },
                  LastName: 'Song',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001T0000007AkXjIAK',
            },
            Name: 'sForce',
            Contacts: {
              totalSize: 2,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsAEIAZ',
                  },
                  LastName: 'Llorrac',
                },
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003T000000FzsADIAZ',
                  },
                  LastName: 'Nedaerk',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B0000002GchlIAC',
            },
            Name: 'ACME Laboratories',
            Contacts: {
              totalSize: 1,
              done: true,
              records: [
                {
                  attributes: {
                    type: 'Contact',
                    url: '/services/data/v51.0/sobjects/Contact/003B0000003gFTfIAM',
                  },
                  LastName: 'Wang',
                },
              ],
            },
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoQIAS',
            },
            Name: 'E & A WORLDWIDE TRADERS',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoRIAS',
            },
            Name: 'Investec (Uk) Limited',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoSIAS',
            },
            Name: 'UV Networks',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoTIAS',
            },
            Name: 'M-Spectr',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoUIAS',
            },
            Name: 'Slow Poke',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoVIAS',
            },
            Name: 'Gas Natural S.A. ESP',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoWIAS',
            },
            Name: 'Biddesk',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoXIAS',
            },
            Name: 'The Clearing',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoYIAS',
            },
            Name: 'Cherrytree Support Services',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoZIAS',
            },
            Name: 'Stuart  Dean Co. Inc.',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcoaIAC',
            },
            Name: 'TAIWAN SHIN KONG SECURITY CO., LTD.',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcobIAC',
            },
            Name: 'Weller Truck Parts LLC',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcocIAC',
            },
            Name: 'GC Pizza Hut',
            Contacts: null,
          },
          {
            attributes: {
              type: 'Account',
              url: '/services/data/v51.0/sobjects/Account/001B000000rXcodIAC',
            },
            Name: 'Architectural Tile & Marble',
            Contacts: null,
          },
        ],
      },
    },
  },
  queryWithAgregates: {
    soqlQueryResult: {
      query: 'SELECT Name, Avg(AnnualRevenue) FROM Account GROUP BY Name',
      columns: [
        { fieldType: FieldType.field, name: 'Name' },
        { fieldType: FieldType.functionField, name: 'avg(AnnualRevenue)' },
      ],
      result: {
        totalSize: 16,
        done: true,
        records: [
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Sample Account for Entitlements',
            expr0: null,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'sForce',
            expr0: null,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'United Oil & Gas, Singapore',
            expr0: null,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Edge Communications',
            expr0: 139000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'University of Arizona',
            expr0: null,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'United Oil & Gas Corp.',
            expr0: 5600000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Pyramid Construction Inc.',
            expr0: 950000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Grand Hotels & Resorts Ltd',
            expr0: 500000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Dickenson plc',
            expr0: 50000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'baz',
            expr0: null,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Burlington Textiles Corp of America',
            expr0: 350000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'zzzzz',
            expr0: 10,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'United Oil & Gas, UK',
            expr0: null,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'Express Logistics and Transport',
            expr0: 950000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'GenePoint',
            expr0: 30000000,
          },
          {
            attributes: {
              type: 'AggregateResult',
            },
            Name: 'foo',
            expr0: 100,
          },
        ],
      },
    },
  },
  queryWithIdFilters: {
    query: "SELECT Id, name FROM Contact where Id = '003B000000DkDswIAF'",
    queryResult: {
      totalSize: 1,
      done: true,
      records: [
        {
          attributes: {
            type: 'Contact',
            url: '/services/data/v51.0/sobjects/Contact/003B000000DkDswIAF',
          },
          Id: '003B000000DkDswIAF',
          Name: 'Matteo Crippa',
        },
      ],
    },
    soqlQueryResult: {
      columns: queryFieldsExemplars.queryWithIdFilters.columns,
      query: "SELECT Id, Name FROM Contact where Id = '003B000000DkDswIAF'",
      result: {
        totalSize: 1,
        done: true,
        records: [
          {
            attributes: {
              type: 'Contact',
              url: '/services/data/v51.0/sobjects/Contact/003B000000DkDswIAF',
            },
            Id: '003B000000DkDswIAF',
            Name: 'Matteo Crippa',
          },
        ],
      },
    },
  },
};
