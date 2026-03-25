import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FieldLabel } from '../components/form/FieldLabel';
import { TextField } from '../components/form/TextField';
import { TextAreaField } from '../components/form/TextAreaField';
import { SelectField } from '../components/form/SelectField';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const meta: Meta = {
  title: 'Components/FormFields',
  decorators: [
    (Story: React.ComponentType) => (
      <div className="p-6 max-w-xl bg-white rounded-2xl shadow space-y-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const Preview: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const [about, setAbout] = useState('');
    const [visibility, setVisibility] = useState('PUBLIC');

    return (
      <>
        <div>
          <FieldLabel>Email</FieldLabel>
          <TextField
            type="email"
            placeholder="Email Address"
            leftIcon={<EnvelopeIcon />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <FieldLabel>About</FieldLabel>
          <TextAreaField
            rows={3}
            placeholder="Tell us something..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="resize-none"
          />
        </div>

        <div>
          <FieldLabel>Visibility</FieldLabel>
          <SelectField value={visibility} onChange={(e) => setVisibility(e.target.value)} className="appearance-none">
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </SelectField>
        </div>
      </>
    );
  },
};

