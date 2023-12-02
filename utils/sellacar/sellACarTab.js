import {
    RegistrationNumber,
    BodyComponent,
    SearchBrandComponent,
    ModelComponent,
    RegistrationStateComponent,
    ImageInterior,
    ImageExterior,
    PlanningToSell,
    UserDetails,
  } from "../../components/sellcarcomponents/components";


export const Tabs = [
    {
        tabIndex: 1,
        tabOrder: 1,
        tabName: 'Reg-Number',
        tabComponent:<RegistrationNumber/>
    },
    {
        tabIndex: 2,
        tabOrder: 2,
        tabName: 'MFG year',
        tabComponent:<RegistrationNumber/>

    },
    {
        tabIndex: 3,
        tabOrder: 3,
        tabName: 'Brand',
        tabComponent:<RegistrationNumber/>
    },
    {
        tabIndex: 4,
        tabOrder: 4,
        tabName: 'Model',
        tabComponent:<RegistrationNumber/>
    },
    {
        tabIndex: 5,
        tabOrder: 5,
        tabName: 'Body',
        tabComponent:<RegistrationNumber/>
    },
    {
        tabIndex: 6,
        tabOrder: 6,
        tabName: 'Reg-State',
        tabComponent:<RegistrationNumber/>
    },
    {
        tabIndex: 7,
        tabOrder: 7,
        tabName: 'KMS Driven',
    },
    {
        tabIndex: 8,
        tabOrder: 8,
        tabName: 'Fuel',
    },
    {
        tabIndex: 9,
        tabOrder: 9,
        tabName: 'Vehicle Condition',
    },
    {
        tabIndex: 10,
        tabOrder: 10,
        tabName: 'Vehicle Location',
    },
    {
        tabIndex: 11,
        tabOrder: 11,
        tabName: ' Interior image',
    },
    {
        tabIndex: 12,
        tabOrder: 12,
        tabName: ' Exterior image',
    },
    {
        tabIndex: 13,
        tabOrder: 13,
        tabName: 'Planning',
    },
    {
        tabIndex: 14,
        tabOrder: 14,
        tabName: 'User Details',
    },
];
