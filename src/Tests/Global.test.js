import React                              from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act }                            from 'react-dom/test-utils';
import { environment }                    from '../Functions/Firebase';


it("Deployment in PRO", () => {
    
    expect(environment).toBe('PRO');
    
});
