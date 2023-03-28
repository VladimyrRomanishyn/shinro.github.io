import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SyntaxHighlightService {

  constructor() { }

  setHTMLHightlight(listing: string): string {
    if (!listing) {return ''}
  
    const tagStartCb = (match: {groups: any} | null, dataId: string) :string => {
      let result = match?.groups.sline || '';

      result += match?.groups.less ? '<span class="less">&#60;</span>' : '';
      result += match?.groups.tag ? `<span class="tag">${match.groups.tag}</span>` : '';
      
      if (match?.groups.attr) {
          const byLine = match.groups.attr.split(' ');
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
      return  match?.groups.text && /\w+/.test(match.groups.text)
        ? `<span contenteditable data-id="${dataId}" class="text">${match.groups.text}</span>`
        : `<span contenteditable data-id="${dataId}" class="text"></span>`;
    }

    const tagEndCb = (match: {groups: any} | null): string => {
      let result = match?.groups.sline || '';
      result += match?.groups.less ? '<span class="less">&#60;</span>' : '';
      result += match?.groups.etag ? `<span class="tag">${match.groups.etag}</span>` : '';
      return result += match?.groups.greater ? '<span class="greater">&#62;</span>' : '';
      //return result += result += match?.groups.eline || '';
    }

    const attrCb = (match: {groups: any} | null, dataId: string): string => {
      let result = `<span class="attr-name">${match?.groups.name}</span>`;
      
      result += match?.groups.eq ? `<span class='equal'>=</span>` : '';
      result += match?.groups.qu ? `<span class='quote'>${match?.groups.qu}</span>` : '';
      result += match?.groups.value ? `<span contenteditable data-id="${dataId}" class='class-value'>${match?.groups.value}</span>` : '';
      return result += match?.groups.lqu ? `<span class='quote'>${match?.groups.qu}</span>` : '';
    };

    const tagStartRegex = /^(?<sline>\s+)?(?<less><)(?<tag>\w+)(?:\s(?<attr>.*?))?(?<greater>>)(?<eline>\s+$)?/;
    const textContentRegex = /(?:>|^)(?<text>(?:\s|\w)+)(?:<|$)/;
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
      //@ts-ignore
      dataId = line.match(dataIdRegex)?.groups?.dataId ?? dataId;
      line = line.replace(dataIdRegex, '');
      
      return searchParams.reduce((acc, params) => {
        const [regex, cb] = params;
        const res = line.match(regex as any);
        //@ts-ignore
        acc += cb(res, dataId);
        return acc
      }, '');
    })

    return result.join('\n') || '';
  }

  setCSSHightlight(listing: string): string {
    if (!listing) {return ''}
    
    const ruleStartRegex = /(?<dot>\.)(?<name>[\w-]+)\s+(?<brace>{)/;
    const propRegex = /^(?<sline>\s+)?(?<prop>[\w-]+)\s*(?<colon>:)\s*(?<value>.+?)(?<semi>;)/;
    const ruleEndRexeg = /(?<brace>})/;

    const ruleEndCb = (match: {groups: any}): string => {
      return match?.groups.brace ? '<span class="brace">}\n</span>' : '';

    };

    const propCb = (match: {groups: any}): string => {
      let result = match?.groups.sline || '';

      result += match?.groups.prop ? `<span contenteditable class="prop">${match.groups.prop}</span>` : '';
      result += match?.groups.colon ? `<span class="colon">&nbsp;:</span>` : '';
      result += match?.groups.value ? ` <span contenteditable class="value">${match.groups.value}</span>` : '';
      return result += match?.groups.semi ? `<span class="semi">&nbsp;;</span>` : '';
    };
    
    const ruleStartCb = (match: {groups: any}): string => {
      let result = match?.groups.dot ? '<span class="dot">.</span>' :'';

      result += match?.groups.name ? `<span contenteditable class="selector">${match.groups.name}</span>` : '';
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
