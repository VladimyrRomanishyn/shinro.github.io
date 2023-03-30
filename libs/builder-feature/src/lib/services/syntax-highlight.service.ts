import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SyntaxHighlightService {
  setHTMLHightlight(listing: string): string {
    
    if (!listing) {return ''}
    const offsetStack: string[] = [];
    
    const tagStartCb = (match: {groups: any} | null, dataId: string) :string => {
      let result = match?.groups.less ? '<span class="less">&#60;</span>' : '';
      result += match?.groups.tag ? `<span class="tag">${match.groups.tag}</span>` : '';
      
      if (match?.groups.attr) {
          const byLine = match.groups.attr.split('\b');
      
          result += byLine.reduce((acc: string, line: string) => {
            const match = line.match(attrRegex);
            // @ts-ignore
            acc += attrCb(match, dataId);
            return acc;
          }, ' ');
      }

      return result += match?.groups.greater ? '<span class="greater">&#62;</span>' : '';
    }

    const textContentCb = (match: {groups: any} | null, dataId: string): string => {
      return  match?.groups.text && /\S+/.test(match?.groups.text)
        ? `<span contenteditable data-id="${dataId}" class="text">${match.groups.text}</span>`
        : `<span contenteditable data-id="${dataId}" class="text"></span>`;
    }

    const tagEndCb = (match: {groups: any} | null): string => {
      let result = match?.groups.less ? '<span class="less">&#60;</span>' : '';
      result += match?.groups.etag ? `<span class="tag">${match.groups.etag}</span>` : '';
      return result += match?.groups.greater ? '<span class="greater">&#62;</span>' : '';
    }

    const attrCb = (match: {groups: any} | null, dataId: string): string => {
      let result = `<span class="attr-name">${match?.groups.name}</span>`;
      
      result += match?.groups.eq ? `<span class='equal'>=</span>` : '';
      result += match?.groups.qu ? `<span class='quote'>${match?.groups.qu}</span>` : '';
      result += match?.groups.value ? `<span contenteditable data-id="${dataId}" class='class-value'>${match?.groups.value}</span>` : '';
      return result += match?.groups.lqu ? `<span class='quote'>${match?.groups.qu}</span>` : '';
    };
    const offsetRegex = /^(?<sline>\s+)?(?<less><)/
    const tagStartRegex = /(?<less><)(?<tag>\w+)(?:\s(?<attr>.*?))?(?<greater>>)/;
    const textContentRegex = /(?:>|^)(?<text>[\w\s(&nbsp;)]+)(?:<|$)/;
    const tagEndRegex = /(?<less><)(?<etag>\/\w+)(?<greater>>)(?<eline>\s+$)?/;
    const attrRegex = /^(?<sline>\s+)?(?<name>[\w-]+)(?:(?<eq>=)(?<qu>'|")(?<value>.+)(?<lqu>'|"))?$/;
    
    const searchParams = [
      [tagStartRegex,  tagStartCb],
      [textContentRegex,  textContentCb],
      [tagEndRegex,  tagEndCb],
    ];
    const byLine = listing.split('\n');
    
    let dataId: string;

    const result = byLine.map(line => {
      const dataIdRegex = /data-id="(?<dataId>[\w-]+)"\s/;
      const offsetMatch = line.match(offsetRegex);
      //@ts-ignore
      offsetStack.push(offsetMatch?.groups?.sline || '')
      //@ts-ignore
      dataId = line.match(dataIdRegex)?.groups?.dataId ?? dataId;
      line = line.replace(dataIdRegex, '');
      
      const newLine = searchParams.reduce((acc, params) => {
        const [regex, cb] = params;
        const res = line.match(regex as any);
        //@ts-ignore
        acc += cb(res, dataId);
        return acc
      }, '');
      const offset = offsetStack.pop() ?? ''
      return  offset + newLine;
    })

    return result.join('\n') || '';
  }

  setCSSHightlight(listing: string): string {
    if (!listing) {return ''}
    
    const ruleStartRegex = /(?<selector>.+)\s+(?<brace>{)/;
    const propRegex = /^(?<sline>\s+)?(?<prop>[\w-]+)\s*(?<colon>:)\s*(?<value>.+?)(?<semi>;)/;
    const ruleEndRexeg = /(?<brace>})/;

    const ruleEndCb = (match: {groups: any}): string => {
      return match?.groups.brace ? '<span class="brace">}</span></span>\n' : '';

    };

    const propCb = (match: {groups: any}): string => {
      let result = match?.groups.prop 
        ? `<span class="prop-wrapper">&nbsp;&nbsp;<span class="remove-prop">x</span><span contenteditable class="prop">${match.groups.prop}</span>` : '';
      result += match?.groups.colon ? `<span class="colon">&nbsp;:</span>` : '';
      result += match?.groups.value ? ` <span contenteditable class="value">${match.groups.value}</span>` : '';
      return result += match?.groups.semi ? `<span class="semi">&nbsp;;</span><span class="add-prop">+</span></span>` : '';
    };
    
    const ruleStartCb = (match: {groups: any, input: string}): string => {
      let result = '';
      
      if (match?.groups?.selector) {
        const idMatch = match.input.match(/<(?<id>.+?)>/);
        //@ts-ignore
        result = `<span data-id=${idMatch?.groups.id || ''} class="rule">`;
        const byLine: string[] = match?.groups?.selector.split(' ');
        
        result += byLine.map(line => {
          const byClass = line.split('.');
          
          return byClass.map((name) => {
            return name ? `<span class="className">${name}</span>` : '';
          }).join('<span class="dot">.</span>')
          
        }).join(' ');
      }
      
      return result += match?.groups.brace ? `<span class="brace">&nbsp;&nbsp;{</span>` : '';
    };
    
    const searchParams = [
      [ruleStartRegex,  ruleStartCb],
      [propRegex,  propCb],
      [ruleEndRexeg,  ruleEndCb],
    ];
    const byLine = listing.split('\n').filter(Boolean);

    const result = byLine.map(line => {
      
      return searchParams.reduce((acc, params) => {
        const [regex, cb] = params;
        const res = line.match(regex as any);
        //@ts-ignore
        acc += cb(res)
        return acc
      }, '');
    });

    return result.join('\n');
  }
}
