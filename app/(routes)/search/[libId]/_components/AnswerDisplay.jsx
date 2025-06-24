import React from 'react';
import DisplaySummary from './DisplaySummary';
import SourceDisplay from './SourceDisplay';

function AnswerDisplay({ chat, loadingSearch }) {
  return (
    <div className="flex gap-2 flex-wrap mt-5">
      <SourceDisplay searchResult={chat?.searchResult} loadingSearch={loadingSearch} />
      <DisplaySummary aiResp={chat?.aiResp} />
    </div>
  );
}

export default AnswerDisplay;
