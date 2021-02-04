import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


function comapreTag(a, b) {
  if ( a.tag < b.tag ) {
    return -1;
  }
  if ( a.tag > b.tag ) {
    return 1;
  }
  return 0;
}

const CheckboxLabels = ({ filters, handleFilter, disabled=false }) => {
  return (
    <FormGroup row>
      {Object.values(filters).sort(comapreTag).map((filter) => (
          <FormControlLabel
            key={filter.tag}
            disabled={disabled}
            control={
              <Checkbox
                name={filter.tag}
                checked={filter.state}
                onChange={() => handleFilter(filter)}
                color="primary"
              />
            }
            label={filter.label}
          />
        ))
      }
    </FormGroup>
  );
}

export default CheckboxLabels;