import * as React from 'react';

const Checkbox = ({ label, value, onChange }) => {
  return (
    <label>
      <input type="checkbox" checked={value ? "Checked" : undefined} onChange={onChange} />
      {label}
    </label>
  );
};

export default Checkbox;