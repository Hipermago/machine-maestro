import type { TaskTemplate } from '@/types/machine';

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'tpl-01',
    title: 'Electrical Connection Verification',
    description: 'Verify all electrical connections, check wiring integrity, and confirm proper grounding per machine specification.',
    order: 1,
    category: 'Electrical',
  },
  {
    id: 'tpl-02',
    title: 'Communication Protocol Setup',
    description: 'Configure communication protocols (Modbus, Profinet, EtherCAT) and verify data exchange with PLC.',
    order: 2,
    category: 'Communication',
  },
  {
    id: 'tpl-03',
    title: 'Sensor Alignment & Calibration',
    description: 'Align all sensors to reference positions and perform initial calibration readings. Record baseline values.',
    order: 3,
    category: 'Sensors',
  },
  {
    id: 'tpl-04',
    title: 'Scale Calibration',
    description: 'Calibrate weighing scales using certified reference weights. Record deviation values and adjust zero offset.',
    order: 4,
    category: 'Calibration',
  },
  {
    id: 'tpl-05',
    title: 'Physical Limit Setting',
    description: 'Set mechanical and software limits for all axes. Record position increments and SCS limits.',
    order: 5,
    category: 'Mechanical',
  },
  {
    id: 'tpl-06',
    title: 'Safety System Check',
    description: 'Test all safety interlocks, emergency stops, light curtains, and safety PLCs. Verify response times.',
    order: 6,
    category: 'Safety',
  },
  {
    id: 'tpl-07',
    title: 'Speed Curve Configuration',
    description: 'Program speed profiles and acceleration/deceleration curves. Verify smooth operation at all set points.',
    order: 7,
    category: 'Motion',
  },
  {
    id: 'tpl-08',
    title: 'Position Increment Calibration',
    description: 'Calibrate position increments for all moving axes. Verify repeatability within specified tolerance band.',
    order: 8,
    category: 'Calibration',
  },
  {
    id: 'tpl-09',
    title: 'Emergency Stop Testing',
    description: 'Perform E-Stop tests from all stations. Verify complete machine shutdown within specified response time.',
    order: 9,
    category: 'Safety',
  },
  {
    id: 'tpl-10',
    title: 'Final Commissioning Sign-off',
    description: 'Complete final inspection checklist, run production test cycle, and obtain supervisor sign-off.',
    order: 10,
    category: 'Final',
  },
];
