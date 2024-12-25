interface Setting {
  name: string;
  inputs: Array<{
    control_label: string;
    value: any;
    inputs?: Array<{
      control_label: string;
      value: any;
    }>;
  }>;
}

interface Audit {
  name: string;
  displayValue: string;
}

export const formatSystemMessage = ({
  data,
  settings,
  license,
  activeReport,
  activeGear,
  testMode,
}: {
  data: any;
  settings: Setting[];
  license: any;
  activeReport: string;
  activeGear: string;
  testMode: boolean;
}) => {
  const formatSettings = () => {
    let settingsStr = '';
    settings?.forEach((setting) => {
      settingsStr += `\n- **${setting.name}**:\n`;
      setting.inputs.forEach((input) => {
        settingsStr += `    - ${input.control_label}: ${input.value ? 'Enabled' : 'Disabled'}\n`;
        if (input.inputs) {
          input.inputs.forEach((subInput) => {
            settingsStr += `    - ${subInput.control_label}: "${subInput.value}"\n`;
          });
        }
      });
    });
    return settingsStr;
  };

  const formatAudits = () => {
    const opportunities = data?.grouped?.opportunities || [];
    const diagnostics = data?.grouped?.diagnostics || [];
    const passedAudits = data?.grouped?.passed_audits || [];

    return `
    - **Opportunities**:
      ${opportunities.map((audit: Audit) => `- **${audit.name}**: ${audit.displayValue}`).join('\n        ')}
    - **Diagnostics**:
      ${diagnostics.map((audit: Audit) => `- **${audit.name}**: ${audit.displayValue}`).join('\n        ')}
    - **Passed Audits**: Total of ${passedAudits.length}
    `;
  };

  return `
    **User Details:**   
    - **Name**: ${license?.name || 'Unknown'}
    - **Website URL**: [${license?.siteUrl || 'Unknown'}](${license?.siteUrl || '#'})

    **Google Page Speed Report Summary:**
    - **FCP**: ${data?.metrics?.find(m => m.id === 'first-contentful-paint')?.displayValue || 'N/A'}
    - **SI**: ${data?.metrics?.find(m => m.id === 'speed-index')?.displayValue || 'N/A'}
    - **TBT**: ${data?.metrics?.find(m => m.id === 'total-blocking-time')?.displayValue || 'N/A'}
    - **LCP**: ${data?.metrics?.find(m => m.id === 'largest-contentful-paint')?.displayValue || 'N/A'}
    - **CLS**: ${data?.metrics?.find(m => m.id === 'cumulative-layout-shift')?.displayValue || 'N/A'}
    - **Performance Score**: ${data?.performance || 'N/A'}

    **Current Page Speed Audits:**
    ${formatAudits()}

    **${license?.name || 'User'}'s Current RapidLoad Settings:**
    Optimizing Device: ${activeReport || 'desktop'}
    Performance Score: ${data?.performance || 'N/A'}
    Test Mode: ${testMode ? 'Enabled' : 'Disabled'}
    Performance Gear: ${activeGear || 'custom'}

    **Speed Settings:**
    ${formatSettings()}
  `;
}; 