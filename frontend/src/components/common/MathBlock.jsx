import React, { useMemo } from 'react';
import katex from 'katex';
import { Sigma } from 'lucide-react';

const cleanLatexFormula = (formula) => {
  if (!formula || typeof formula !== 'string') return '';
  let str = formula.trim();
  if (str.startsWith('$$') && str.endsWith('$$') && str.length >= 4) {
    str = str.slice(2, -2).trim();
  } else if (str.startsWith('$') && str.endsWith('$') && str.length >= 2) {
    str = str.slice(1, -1).trim();
  }
  // Normalize corrupt/double-escaped backslashes before LaTeX command names or symbols: \\mu -> \mu, \\{ -> \{
  str = str.replace(/\\\\(?=[a-zA-Z{}|_%&#$])/g, '\\');
  return str;
};

export const InlineMath = ({ math }) => {
  const html = useMemo(() => {
    if (!math) return '';
    const cleaned = cleanLatexFormula(math);
    try {
      return katex.renderToString(cleaned, {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return cleaned;
    }
  }, [math]);

  if (!math || !html) return null;

  return (
    <span
      className="inline-math px-0.5 text-[#00F0FF] font-normal inline-block align-baseline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const MathText = ({ children }) => {
  if (typeof children !== 'string') return <>{children}</>;

  const parts = children.split(/(\$[^$]+\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
          const formula = part.slice(1, -1);
          return <InlineMath key={index} math={formula} />;
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
};

export const MathBlock = ({ formula, title = 'Mathematical Formulation', description }) => {
  const html = useMemo(() => {
    if (!formula) return '';
    const cleaned = cleanLatexFormula(formula);
    try {
      return katex.renderToString(cleaned, {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return `<span class="katex-error text-[#FF2E93]">${cleaned}</span>`;
    }
  }, [formula]);

  if (!formula || !html) return null;

  return (
    <div className="border border-[#231542] bg-[#0C081A] p-4 shadow-sm relative">
      <div className="flex items-center space-x-2 text-cyan-300 text-xs font-['Silkscreen'] uppercase tracking-wide mb-2 font-semibold">
        <Sigma className="w-4 h-4 text-[#00F0FF]" />
        <span>{title}</span>
      </div>

      <div className="bg-[#06040D] p-3 border border-[#1C1133] text-[#00F0FF] text-sm overflow-x-auto tracking-normal text-center [&_.katex-display]:my-1">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      {description && (
        <p className="text-xs text-gray-300 mt-2.5 leading-relaxed font-sans">
          <MathText>{description}</MathText>
        </p>
      )}
    </div>
  );
};

export default MathBlock;
