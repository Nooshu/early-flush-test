const express = require('express');
const app = express();
const serverless = require('serverless-http');
const port = 3000;
const path = require('path');
const fs = require('fs');
const router = express.Router();

var startHtml = `<!doctype html>
<html>
  <head>
  <script>window.performance.mark('head_start');</script>
    <meta charset="utf-8">
    <title>Testing the flush mechanism</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script>
    function mySlowFunction(baseNumber) {
      console.time('mySlowFunction');
      let result = 0;	
      for (var i = Math.pow(baseNumber, 7); i >= 0; i--) {		
          result += Math.atan(i) * Math.tan(i);
      };
      console.timeEnd('mySlowFunction');
    }
    </script>
    <script>mySlowFunction(5);</script>
    <script>window.performance.mark('head_end');</script>
</head><body><h1>This is a flush test</h1>`;


var endHtml = `
<script>window.performance.mark('body_start');</script>
<div align="center"><center>
<h1 class="fore">When to load CSS</h1>

<table border="0" cellspacing="5" width="100%" bgcolor="#F2F2FF">
  <tr>
    <td><p align="left"><font color="#000080" size="5" face="Tahoma"><strong>Large HTML page
    with Images</strong></font></td>
  </tr>
</table>
</center></div>

<hr>

<p><strong><small><font face="Verdana">This page shall test if the recorder generates
scripts with requests in correct order. It includes images in sequential order: 
through </font></small></strong></p>

<hr>

<p><img src="" width="70" height="70" alt=" (6512 bytes)"><br>
stadyn_image1</p>

<p><img src="" width="70" height="70" alt=" (5983 bytes)"><br>
stadyn_image2</p>

<p align="center"><b><font SIZE="6">Open Financial Exchange<br>
Specification 1.0</font></b> </p>

<p align="center"><b><font SIZE="2">February 14, 1997<br>
</font></b></p>

<p align="center"><b><font SIZE="2">© 1997 CheckFree Corp., Intuit Inc., Microsoft Corp.
All rights reserved<br>
<br>
<br>
</font></b></p>

<p align="center"><i><b><font SIZE="5">Chapters 1 - 10<br>
<br>
<br>
<br>
<br>
</font></b></i></p>

<h1><img src="" width="70" height="70" alt=" (6537 bytes)"><br>
<font SIZE="5">stadyn_image3</font></h1>

<h1><img src="" width="70" height="70" alt=" (6028 bytes)"><br>
stadyn_image4</h1>

<p><img src="" width="70" height="70" alt=" (4068 bytes)"><br>
stadyn_image5</p>

<p>&nbsp;</p>

<p>&nbsp;</p>

<h1><a NAME="_Toc371408167"><font SIZE="5">Contents</font></a></h1>

<p>1. Overview 51.1 Introduction 51.1.1 Design Principles 51.2 Open Financial Exchange at
a Glance 71.2.1 Data Transport 71.2.2 Request and Response Model 81.3 Conventions 92.
Structure 102.1 HTTP Headers 102.2 Open Financial Exchange Headers 112.2.1 The Meaning of
Version Numbers 122.3 SGML Details 122.3.1 Compliance 122.3.2 Special Characters 122.4
Open Financial Exchange SGML Structure 132.4.1 Overview 132.4.2 Top Level 132.4.3 Messages
132.4.4 Message Sets and Version Control 142.4.5 Transactions 152.5 The Signon Message Set
162.5.1 Signon &lt;SONRQ&gt; &lt;SONRS&gt; 162.5.2 PIN Change &lt;PINCHRQ&gt;
&lt;PINCHRS&gt; 192.5.3 Examples 202.6 External Data Support 202.7 Extensions to Open
Financial Exchange 213. Common Aggregates, Elements, and Data Types 223.1 Common
Aggregates 223.1.1 Identifying Financial Institutions and Accounts 223.1.2 Balance Records
&lt;BAL&gt; 223.1.3 Error Reporting &lt;STATUS&gt; 233.2 Common Elements 243.2.1 Financial
Institution Transaction ID &lt;FITID&gt; 243.2.2 Server-Assigned ID &lt;SRVRTID&gt;
243.2.3 Client-Assigned Transaction UID &lt;TRNUID&gt; 253.2.4 Token &lt;TOKEN&gt; 253.2.5
Transaction Amount &lt;TRNAMT&gt; 253.2.6 Memo &lt;MEMO&gt; 253.2.7 Date Start and Date
End &lt;DTSTART&gt; &lt;DTEND&gt; 263.3 Common data types 263.3.1 Dates and Times 263.3.2
Amounts, Prices, and Quantities 283.3.3 Language 283.3.4 Basic data types 284. Security
294.1 Security Solutions 294.1.1 Determining Security Levels &lt;OFXSEC&gt;
&lt;TRANSPSEC&gt; 294.2 Channel-Level Security 304.2.1 Security Requirements 304.2.2 Using
SSL 3.0 in Open Financial Exchange 304.3 Application-Level Security 314.3.1 Requirements
for Application-Layer Security 314.3.2 Using Application-level Encryption in Open
Financial Exchange 325. International Support 335.1 Language and Encoding 335.2 Currency
&lt;CURDEF&gt; &lt;CURRENCY&gt; &lt;ORIGCURRENCY&gt; 335.3 Country-Specific Tag Values
346. Data Synchronization 356.1 Overview 356.2 Background 356.3 Data Synchronization
Approach 366.4 Data Synchronization Specifics 376.5 Conflict Detection and Resolution
396.6 Synchronization vs. Refresh 406.7 Typical Server Architecture for Synchronization
416.8 Typical Client Processing of Synchronization Results 436.9 Simultaneous Connections
446.10 Synchronization Alternatives 446.10.1 Lite Synchronization 446.10.2 Relating
Synchronization and Error Recovery 456.11 Examples 467. FI Profile 487.1 Overview 487.1.1
Message Sets 487.1.2 Version Control 497.1.3 Batching and Routing 497.2 Profile Request
507.3 Profile Response 517.3.1 Message Set 527.3.2 Signon Realms 537.3.3 Status Codes
537.4 Profile Message Set Profile Information 548. Activation &amp; Account Information
558.1 Overview 558.2 Approaches to User Sign-Up with Open Financial Exchange 558.3 Users
and Accounts 568.4 Enrollment and Password Acquisition &lt;ENROLLRQ&gt; &lt;ENROLLRS&gt;
568.4.1 User IDs 578.4.2 Enrollment Request 578.4.3 Enrollment Response 598.4.4 Enrollment
Status Codes 598.4.5 Examples 608.5 Account Information 608.5.1 Request &lt;ACCTINFORQ&gt;
618.5.2 Response &lt;ACCTINFORS&gt; 618.5.3 Account Information Aggregate &lt;ACCTINFO&gt;
628.5.4 Status Codes 628.5.5 Examples 638.6 Service Activation 638.6.1 Activation Request
and Response 648.6.2 Service Activation Synchronization 668.6.3 Examples 668.7 Name and
Address Changes &lt;CHGUSERINFORQ&gt; &lt;CHGUSERINFORS&gt; 678.7.1 &lt;CHGUSERINFORQ&gt;
678.7.2 &lt;CHGUSERINFORS&gt; 688.7.3 Status Codes 688.8 Signup Message Set Profile
Information 699. Customer to FI Communication 709.1 The E-Mail Message Set 709.2 E-Mail
Messages 709.2.1 Regular vs. Specialized E-Mail 719.2.2 Basic &lt;MAIL&gt; Aggregate
719.2.3 E-Mail &lt;MAILRQ&gt; &lt;MAILRS&gt; 719.2.4 E-Mail Synchronization
&lt;MAILSYNCRQ&gt; &lt;MAILSYNCRS&gt; 729.2.5 Example 739.3 Get HTML Page 749.3.1 MIME Get
Request and Response &lt;GETMIMERQ&gt; &lt;GETMIMERS&gt; 749.3.2 Example 759.4 E-Mail
Message Set Profile Information 7610. Recurring Transactions 7710.1 Creating a Recurring
Model 7710.2 Recurring Instructions &lt;RECURRINST&gt; 7710.2.1 Values for &lt;FREQ&gt;
7810.2.2 Examples 7910.3 Retrieving Transactions Generated by a Recurring Model 8010.4
Modifying and Canceling Individual Transactions 8010.5 Modifying and Canceling Recurring
Models 8010.5.1 Examples 81 

<ol>
  <li><a NAME="_Toc380493239"><font SIZE="6" FACE="Arial">Overview</font></a> </li>
  <li><a NAME="_Toc380493240"><font SIZE="5" FACE="Arial">Introduction</font></a> </li>
</ol>

<p><font SIZE="2">Open Financial Exchange is a broad-based framework for exchanging
financial data and instructions between customers and their financial institutions. It
allows institutions to connect directly to their customers without requiring an
intermediary. <br>
<br>
</font></p>

<p><font SIZE="2">Open Financial Exchange is an open specification that anyone can
implement: any financial institution, transaction processor, software developer or other
party. It uses widely accepted open standards for data formatting (such as SGML),
connectivity (such as TCP/IP and HTTP), and security (such as SSL).</font> </p>

<p><font SIZE="2">Open Financial Exchange defines the request and response messages used
by each financial service as well as the common framework and infrastructure to support
the communication of those messages. This specification does not describe any specific
product implementation.</font> 

<ol>
  <li><a NAME="_Toc380493241"><font SIZE="4" FACE="Arial">Design Principles</font></a> </li>
</ol>

<p><font SIZE="2">The following principles were used in designing Open Financial Exchange:</font>
</p>

<p><font SIZE="1" FACE="Wingdings">l</font><font SIZE="2"> </font><font SIZE="2"
FACE="Arial"><b>Broad</b> <b>Range of Financial Activities</b></font><font SIZE="2"> -
Open Financial Exchange provides support for a <i><b>broad</b></i> range of financial
activities. Open Financial Exchange 1.0 specifies the following services:</font> </p>

<p><font SIZE="1" FACE="Wingdings">n</font><font SIZE="2"> Bank statement download</font> </p>

<p><font SIZE="1" FACE="Wingdings">n</font><font SIZE="2"> Credit card statement download</font>
</p>

<p><font SIZE="1" FACE="Wingdings">n</font><font SIZE="2"> Funds transfers including
recurring transfers</font> </p>

<p><font SIZE="1" FACE="Wingdings">n</font><font SIZE="2"> Consumer payments, including
recurring payments</font> </p>

<p><font SIZE="1" FACE="Wingdings">n</font><font SIZE="2"> Business payments, including
recurring payments</font> </p>

<p><font SIZE="1" FACE="Wingdings">n</font><font SIZE="2"> Brokerage and mutual fund
statement download, including transaction history, current holdings and balances</font> </p>

<p><font SIZE="1" FACE="Wingdings">l</font><font SIZE="2"> </font><font SIZE="2"
FACE="Arial"><b>Broad</b> <b>Range of Financial Institutions</b></font><font SIZE="2"> -
Open Financial Exchange supports communication with a <i><b>broad</b></i> range of
financial institutions (FIs), including:</font> </p>

<p><font SIZE="1" FACE="Wingdings">n</font><font SIZE="2"> Banks</font> </p>

<p><font SIZE="1" FACE="Wingdings">n</font><font SIZE="2"> Brokerage houses</font> </p>

<p><font SIZE="1" FACE="Wingdings">n</font><font SIZE="2"> Merchants</font> </p>

<p><font SIZE="1" FACE="Wingdings">n</font><font SIZE="2"> Processors</font> </p>

<p><font SIZE="1" FACE="Wingdings">n</font><font SIZE="2"> Financial advisors</font> </p>

<p><font SIZE="1" FACE="Wingdings">n</font><font SIZE="2"> Government agencies</font> </p>

<p><font SIZE="1" FACE="Wingdings">l</font><font SIZE="2"> </font><font SIZE="2"
FACE="Arial"><b>Broad</b> <b>Range of Front-End applications</b></font><font SIZE="2"> -
Open Financial Exchange supports a <i><b>broad </b></i>range of front-end applications
covering all types of financial activities running on all types of platforms, including
Web-based applications.</font> </p>

<p><font SIZE="1" FACE="Wingdings">l</font><font SIZE="2"> </font><b><font SIZE="2"
FACE="Arial">Extensible</font></b><font SIZE="2"> - Open Financial Exchange has been
designed to allow the easy addition of new services. Future versions will include support
for many new services.</font> </p>

<p><font SIZE="1" FACE="Wingdings">l</font><font SIZE="2"> </font><b><font SIZE="2"
FACE="Arial">Open</font></b><font SIZE="2"> - This specification is publicly available.
You can build client and server applications using the Open Financial Exchange protocols
independent of any specific technology, product, or company.</font> </p>

<p><font SIZE="1" FACE="Wingdings">l</font><font SIZE="2"> </font><b><font SIZE="2"
FACE="Arial">Multiple Client Support</font></b><font SIZE="2"> - Open Financial Exchange
allows a user to use multiple client applications to access the same data at a financial
institution. With the popularity of the World Wide Web, customers are increasingly more
likely to use multiple applications-either desktop-based or Web-based-to perform financial
activities. For example, a customer can track personal finances at home with a desktop
application and occasionally pay bills while at work with a Web-based application. The use
of data synchronization to support multiple clients is a key innovation in Open Financial
Exchange.</font> </p>

<p><font SIZE="1" FACE="Wingdings">l</font><font SIZE="2"> </font><b><font SIZE="2"
FACE="Arial">Robust</font></b><font SIZE="2"> - Open Financial Exchange will be used for
executing important financial transactions and for communicating important financial
information. Assuring users that transactions are executed and information is correct is
crucial. Open Financial Exchange provides robust protocols for error recovery.</font> </p>
<script>mySlowFunction(5);</script>
<p><font SIZE="1" FACE="Wingdings">l</font><font SIZE="2"> </font><b><font SIZE="2"
FACE="Arial">Secure</font></b><font SIZE="2"> - Open Financial Exchange provides a
framework for building secure online financial services. In Open Financial Exchange,
security encompasses authentication of the parties involved, as well as secrecy and
integrity of the information being exchanged.</font> </p>

<p><font SIZE="1" FACE="Wingdings">l</font><font SIZE="2"> </font><b><font SIZE="2"
FACE="Arial">Batch &amp; Interactive</font></b><font SIZE="2"> - The design of request and
response messages in Open Financial Exchange is for use in either batch or interactive
style of communication. Open Financial Exchange provides for applying a single
authentication context to multiple requests in order to reduce the overhead of user
authentication.</font> </p>

<p><font SIZE="1" FACE="Wingdings">l</font><font SIZE="2"> </font><b><font SIZE="2"
FACE="Arial">International</font></b><font SIZE="2"> </font><b><font SIZE="2" FACE="Arial">Support</font></b><font
SIZE="2"> - Open Financial Exchange is designed to supply financial services throughout
the world. It supports multiple currencies, country-specific extensions, and different
forms of encoding such as UNICODE.</font> </p>

<p><font SIZE="1" FACE="Wingdings">l</font><font SIZE="2"> </font><b><font SIZE="2"
FACE="Arial">Platform Independent</font></b><font SIZE="2"> -Open Financial Exchange can
be implemented on a wide variety of front-end client devices, including those running
Windows 3.1, Windows 95, Windows NT, Macintosh, or UNIX. It also supports a wide variety
of Web-based environments, including those using HTML, Java, JavaScript, or ActiveX.
Similarly on the back-end, Open Financial Exchange can be implemented on a wide variety of
server systems, including those running UNIX, Windows NT, or OS/2.</font> </p>

<p><font SIZE="1" FACE="Wingdings">l</font><font SIZE="2"> </font><b><font SIZE="2"
FACE="Arial">Transport Independent</font></b><font SIZE="2"> - Open Financial Exchange is
independent of the data communication protocol used to transport the messages between the
client and server computers. Open Financial Exchange 1.0 will use HTTP.</font> 

<ol>
  <li><font SIZE="5" FACE="Arial"><a NAME="_Toc380493242">Open Financial Exchange </a>at a
    Glance</font> </li>
</ol>

<p><font SIZE="2">The design of Open Financial Exchange is as a client and server system.
An end-user uses a client application to communicate with a server at a financial
institution. The form of communication is requests from the client to the server and
responses from the server back to the client.</font> </p>

<p><font SIZE="2">Open Financial Exchange uses the Internet Protocol (IP) suite to provide
the communication channel between a client and a server. IP protocols are the foundation
of the public Internet and a private network can also use them.</font> 

<ol>
  <li><a NAME="_Toc380493243"><font SIZE="4" FACE="Arial">Data Transport</font></a> </li>
</ol>

<p><font SIZE="2">Clients use the HyperText Transport Protocol (HTTP) to communicate to an
Open Financial Exchange server. The World Wide Web throughout uses the same HTTP protocol.
In principle, a financial institution can use any off-the-shelf web server to implement
its support for Open Financial Exchange.</font> </p>

<p><font SIZE="2">To communicate by means of Open Financial Exchange over the Internet,
the client must establish an Internet connection. This connection can be a dial-up
Point-to-Point Protocol (PPP) connection to an Internet Service Provider (ISP) or a
connection over a local area network that has a gateway to the Internet.</font> </p>

<p><font SIZE="2">Clients use the HTTP POST command to send a request to the previously
acquired Uniform Resource Locator (URL) for the desired financial institution. The URL
presumably identifies a Common Gateway Interface (CGI) or other process on an FI server
that can accept Open Financial Exchange requests and produce a response.</font> </p>

<p><font SIZE="2">The POST identifies the data as being of type application/x-ofx. Use
application/x-ofx as the return type as well. Fill in other fields per the HTTP 1.0 spec.
Here is a typical request:</font> </p>

<pre>
<font SIZE="1">POST http://www.fi.com/ofx.cgi HTTP/1.0
User-Agent:MyApp 5.0
Content-Type: application/x-ofx
Content-Length: 1032

OFXHEADER:100
</font><font
SIZE="2">DATA:OFXSGML
VERSION:100
SECURITY:1
ENCODING:USASCII

&lt;OFX&gt;
... Open Financial Exchange requests ...
&lt;/OFX&gt;</font>
</pre>

<p><font SIZE="2">A blank line defines the separation between the HTTP headers and the
start of the actual Open Financial Exchange data. A blank line also separates the Open
Financial Exchange headers and the actual response. (See Chapter 2, for more information.)</font>
</p>

<p><font SIZE="2">The structure of a response is similar to the request, with the first
line containing the standard HTTP result, as shown next. The content length is given in
bytes.</font> </p>

<pre>
<font SIZE="1">HTTP 1.0 200 OK
Content-Type: application/x-ofx
Content-Length: 8732

OFXHEADER:100
</font><font
SIZE="2">DATA:OFXSGML
VERSION:100
SECURITY:1
ENCODING:USASCII

&lt;OFX&gt;
... Open Financial Exchange responses ...
&lt;/OFX&gt;</font>
</pre>

<ol>
  <li><font SIZE="4" FACE="Arial"><a NAME="_Toc380493244">Request and Response</a> Model</font>
  </li>
</ol>

<p><font SIZE="2">The basis for Open Financial Exchange is the request and response model.
One or more requests can be batched in a single file. This file typically includes a
signon request and one or more service-specific requests. An FI server will process all of
the requests and return a single response file. This batch model lends itself to Internet
transport as well as other off-line transports. Both requests and responses are plain text
files, formatted using a grammar based on Standard Generalized Markup Language (SGML).
Open Financial Exchange is syntactically similar to HyperText Markup Language (HTML),
featuring tags to identify and delimit the data. The use of a tagged data format allows
Open Financial Exchange to evolve over time while continuing to support older clients and
servers.</font> </p>

<p><font SIZE="2">Here is a simplified example of an Open Financial Exchange request file.
(This example does not show the Open Financial Exchange headers and the indentation is
only for readability.) For complete details, see the more complete examples throughout
this specification.</font> </p>

<p>&lt;OFX&gt; &lt;!-- Begin request data --&gt; &lt;SIGNONMSGSRQV1&gt; &lt;SONRQ&gt;
&lt;!-- Begin signon --&gt; &lt;DTCLIENT&gt;19961029101000 &lt;!-- Oct. 29, 1996, 10:10:00
am --&gt; &lt;USERID&gt;123-45-6789 &lt;!-- User ID (that is, SSN) --&gt;
&lt;USERPASS&gt;MyPassword &lt;!-- Password (SSL encrypts whole) --&gt;
&lt;LANGUAGE&gt;ENG &lt;!-- Language used for text --&gt; &lt;FI&gt; &lt;!-- ID of
receiving institution --&gt; &lt;ORG&gt;NCH &lt;!-- Name of ID owner --&gt;
&lt;FID&gt;1001 &lt;!-- Actual ID --&gt; &lt;/FI&gt; &lt;APPID&gt;MyApp &lt;APPVER&gt;0500
&lt;/SONRQ&gt; &lt;!-- End of signon --&gt; &lt;/SIGNONMSGSRQV1&gt; &lt;BANKMSGSRQV1&gt;
&lt;STMTTRNRQ&gt; &lt;!-- First request in file --&gt; &lt;TRNUID&gt;1001 &lt;STMTRQ&gt;
&lt;!-- Begin statement request --&gt; &lt;BANKACCTFROM&gt; &lt;!-- Identify the account
--&gt; &lt;BANKID&gt;121099999 &lt;!-- Routing transit or other FI ID --&gt;
&lt;ACCTID&gt;999988 &lt;!-- Account number --&gt; &lt;ACCTTYPE&gt;CHECKING &lt;!--
Account type --&gt; &lt;/BANKACCTFROM&gt; &lt;!-- End of account ID --&gt; &lt;INCTRAN&gt;
&lt;!-- Begin include transaction --&gt; &lt;INCLUDE&gt;Y &lt;!-- Include transactions
--&gt; &lt;/INCTRAN&gt; &lt;!-- End of include transaction --&gt; &lt;/STMTRQ&gt; &lt;!--
End of statement request --&gt; &lt;/STMTTRNRQ&gt; &lt;!-- End of first request --&gt;
&lt;/BANKMSGSRQV1&gt;&lt;/OFX&gt; &lt;!-- End of request data --&gt;<font SIZE="2">The
response format follows a similar structure. Although a response such as a statement
response contains all of the details of each transaction, each element is identified using
tags.</font> </p>

<p><font SIZE="2">The key rule of Open Financial Exchange syntax is that each tag is
either an element or an aggregate. Data follows its element tag. An aggregate tag begins a
compound tag sequence, which must end with a matching tag; for example, &lt;AGGREGATE&gt;
... &lt;/AGGREGATE&gt;. </font></p>

<p><font SIZE="2">The actual file Open Financial Exchange sends is without any extra white
space between tags.</font> 

<ol>
  <li><a NAME="_Toc380493245"><font SIZE="5" FACE="Arial">Conventions</font></a> </li>
</ol>

<p><font SIZE="2">The conventions used in the detailed descriptions include: </font>

<ul>
  <li><font SIZE="2">Required tags are in <b>bold</b>. Regular face indicates tags that are
    optional. Required means that a client will always include a tag in a request, and a
    server must always include a tag in a response.</font> </li>
  <li><font SIZE="2"><i>Italic </i>shows a required or optional aggregate from a set of
    possible aggregates. </font></li>
  <li><font SIZE="2">Required tags occur once unless noted as one or more in the description,
    in which case the specification allows multiple occurrences. </font></li>
  <li><font SIZE="2">Optional tags occur once if present unless noted as zero or more in the
    description, in which case the specification allows multiple occurrences.</font> </li>
  <li><font SIZE="2">Allowable specific values are listed, where applicable.</font> </li>
  <li><font SIZE="2">A-<i>n</i> or N-<i>n</i>, specify those values that take general
    alphanumeric or pure numeric type values, where <i>n</i> indicates the maximum size. </font></li>
  <li><font SIZE="2">References to certain common value types, such as a dollar amount, are by
    name. Chapter 3 lists value types that can be referenced by name.</font> </li>
</ul>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="162"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="336"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;REQUIREDTAG&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Required tag (1 or more)</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;REQUIREDTAG2&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Required tag that occurs only once </font></td>
  </tr>
  <tr>
    <td WIDTH="162"><font SIZE="1">&lt;OPTIONALTAG&gt; </font></td>
    <td WIDTH="336"><font SIZE="2">Optional tag; this particular one can occur multiple times
    (0 or more) </font></td>
  </tr>
  <tr>
    <td WIDTH="162"><font SIZE="1">&lt;SPECIFIC&gt;</font></td>
    <td WIDTH="336"><font SIZE="2">Values are A, B, and C</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><font SIZE="1">&lt;ALPHAVALUE&gt;</font></td>
    <td WIDTH="336"><font SIZE="2">Takes an alphanumeric value up to 32 characters,<i> A-32</i></font>
    </td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493246"><font SIZE="6" FACE="Arial">Structure</font></a> </li>
</ol>

<p><font SIZE="2">This chapter describes the basic structure of an Open Financial Exchange
request and response. Structure includes headers, basic syntax, and the Signon request and
response. This chapter also describes how Open Financial Exchange encodes external data,
such as bit maps.</font> </p>

<p><font SIZE="2">Open Financial Exchange data consists of some headers plus one or more
Open Financial Exchange data blocks. Each block consists of a signon message and zero or
more additional messages. When sent over the internet using HTTP, standard HTTP and
multi-part MIME headers and formats surround the Open Financial Exchange data. A simple
file that contained only Open Financial Exchange data would have the following form:</font>
</p>

<pre>
<font SIZE="1">HTTP headers
MIME type application/x-ofx
Open Financial Exchange headers
Open Financial Exchange SGML block 1</font>
</pre>

<p><font SIZE="2">A more complex file that contained multiple Open Financial Exchange data
blocks and additional Open Financial Exchange data would have this form:</font> </p>

<pre>
<font SIZE="1">HTTP headers
MIME type multipart/x-mixed-replace; boundary =--boundary-
---boundary---
MIME type application/x-ofx
</font><font
SIZE="2">	Open Financial Exchange headers
	Open Financial Exchange SGML block 1
	Open Financial Exchange SGML block 2
---boundary---
	MIME type image/jpeg
		FI logo</font>
</pre>

<ol>
  <li><a NAME="_Toc380493247"><font SIZE="5" FACE="Arial">HTTP Headers</font></a> </li>
</ol>

<p><font SIZE="2">Data delivered by way of HTTP places the standard HTTP result code on
the first line. HTTP defines a number of status codes. Servers can return any standard
HTTP result. However, FIs should expect clients to collapse these codes into the following
three cases:</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="84"><i><font SIZE="1">Code</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="96"><i><font SIZE="2">Meaning</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="312"><i><font SIZE="2">Action</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="84"><font SIZE="1">200</font></td>
    <td WIDTH="96"><font SIZE="2">OK</font> </td>
    <td WIDTH="312"><font SIZE="2">The request was processed and a valid Open Financial
    Exchange result is returned.</font> </td>
  </tr>
  <tr>
    <td WIDTH="84"><font SIZE="1">400s</font></td>
    <td WIDTH="96"><font SIZE="2">Bad request</font> </td>
    <td WIDTH="312"><font SIZE="2">The request was invalid and was not processed. Clients will
    report an internal error to the user.</font> </td>
  </tr>
  <tr>
    <td WIDTH="84"><font SIZE="1">500s</font></td>
    <td WIDTH="96"><font SIZE="2">Server error</font> </td>
    <td WIDTH="312"><font SIZE="2">The server is unavailable. Clients should advise the user
    to retry shortly.</font> </td>
  </tr>
</table>

<p><i><b>NOTE:</b> Open Financial Exchange returns a code 400 only if it cannot parse the
file. Open Financial Exchange handles content errors such as wrong PIN, or invalid
account, by returning a valid Open Financial Exchange response along with code 200.</i> </p>

<p>Open Financial Exchange requires the following HTTP standard headers: </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="84"><i><font SIZE="1">Code</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="96"><i><font SIZE="2">Value</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="312"><i><font SIZE="2">Explanation</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="84"><font SIZE="1">Content-type</font></td>
    <td WIDTH="96"><font SIZE="2">application/x-ofx</font> </td>
    <td WIDTH="312"><font SIZE="2">The MIME type for Open Financial Exchange</font> </td>
  </tr>
  <tr>
    <td WIDTH="84"><font SIZE="1">Content-length</font></td>
    <td WIDTH="96"><font SIZE="2">length</font> </td>
    <td WIDTH="312"><font SIZE="2">Length of the data after removing HTTP headers</font> </td>
  </tr>
</table>

<pre>

</pre>

<p><font SIZE="2">When responding with multi-part MIME, the main type will be
multi-part/x-mixed-replace; <br>
one of the parts will use application/x-ofx.</font> 

<ol>
  <li><a NAME="_Toc380493248"><font SIZE="5" FACE="Arial">Open Financial Exchange Headers</font></a>
  </li>
</ol>

<p><font SIZE="2">The intent of Open Financial Exchange is for use with a variety of
transports and to provide sufficient version control capabilities for future expansion. To
support this goal, the contents of an Open Financial Exchange file consist of a simple set
of headers followed by contents defined by that header. &quot;File format&quot; means the
entire content after removal of any transport headers. The HTTP transport described in
this document, means without the HTTP and MIME headers.</font> </p>

<p><font SIZE="2">The Open Financial Exchange headers are in a simple <i>tag:value</i>
syntax and terminated by a blank line. Open Financial Exchange always sends headers
unencrypted, even if there is application-level encryption in use for the remaining
contents. The first entry will always be OFXHEADER with a version number. This entry will
help identify the contents as an Open Financial Exchange file, and provides the version of
the Open Financial Exchange headers that follow (not of the content itself). For example:</font>
</p>

<pre>
<font SIZE="1">OFXHEADER:100</font>
</pre>

<p><font SIZE="2">This document defines version 1.0 of the headers to contain at least the
following additional tags:</font> </p>

<pre>
<font SIZE="1">DATA:OFXSGML
VERSION:100
SECURITY: 
ENCODING:
</font><font SIZE="2">CHARSET:
COMPRESSION:
OLDFILEUID:
NEWFILEUID:</font>
</pre>
<script>mySlowFunction(5);</script>
<p><font SIZE="2">The data tag identifies the contents as being in OFX SGML form. VERSION
identifies the version type as OFXSGML data. In the case of OFXSGML, it translates to the
version of the Document Type Definition (DTD) that it uses for parsing. The ENCODING and
CHARSET tags define the interpretation of the character data. See Chapter 5,
&quot;International Support&quot; for more information on these tags. Chapter 4 describes
the security tag. A future version of this specification will define compression.</font> </p>

<p><font SIZE="2">Open Financial Exchange uses OLDFILEUID and NEWFILEUID to support error
recovery. They are not present when clients are not requesting error recovery. (See
Chapter 6, &quot;Data Synchronization&quot;)</font> </p>

<p><font SIZE="2">A blank line follows the last tag. Then (for type OFXSGML), the
SGML-readable data begins with the &lt;OFX&gt; tag.</font> </p>

<p><font SIZE="2"><i><b>NOTE:</b> Here, VERSION provides the overall version of the DTD.
The &lt;OFX&gt; block describes the specific message set versions used, shown later in
this chapter.</i></font> 

<ol>
  <li><a NAME="_Toc380493249"><font SIZE="4" FACE="Arial">The Meaning of Version Numbers</font></a>
  </li>
</ol>

<p><font SIZE="2">The OFXHEADER value should only change its major number if an existing
client is unable to process the new header. This can occur because of a complete syntax
change in a header, or a significant change in the semantics of an existing tag-not the
entire response. You can add new tags as long as clients can function without
understanding them.</font> </p>

<p><font SIZE="2">You should add new values for a data tag only when you introduce an
entirely new syntax. In the case of OFXSGML, a new syntax would have to be non-SGML
compliant to warrant a new data value. It is possible that there will be more than one
syntax in use at the same time to meet different needs.</font> </p>

<p><font SIZE="2">The intent of the header version tag is to identify syntactic changes.
In the case of OFXSGML, this corresponds to the DTD. Purely for identification purposes,
each change will increment the minor number of the version tag. If you introduce an
incompatible change so that an older DTD can not parse the file, the major number will
change. See the general discussion of message sets and version control, later in this
chapter.</font> 

<ol>
  <li><a NAME="_Toc380493250"><font SIZE="5" FACE="Arial">SGML Details</font></a> </li>
  <li><a NAME="_Toc380493251"><font SIZE="4" FACE="Arial">Compliance</font></a> </li>
</ol>

<p><font SIZE="2">SGML is the basis for Open Financial Exchange. There is a DTD that
formally defines the SGML wire format. However, Open Financial Exchange is not completely
SGML-<i>compliant</i> because the specification allows unrecognized tags to be present. It
requires clients and servers to skip over the unrecognized material. That is, if
&lt;XYZ&gt;qqq&lt;/XYZ&gt; appeared and a client or server cannot recognize &lt;XYZ&gt;,
the server should ignore that tag and its enclosed data. A fully-compliant SGML parser
would not <i>validate</i> an Open Financial Exchange document if it contained any tags
that the DTD does not define.</font> </p>

<p><font SIZE="2">Although SGML is the basis for the specification, and the specification
is largely compliant with SGML, do not assume Open Financial Exchange supports any SGML
features not documented in this specification. The intent is to allow parsing to be as
simple as possible, while retaining compatibility with the SGML world.</font> 

<ol>
  <li><a NAME="_Toc380493252"><font SIZE="4" FACE="Arial">Special Characters</font></a> </li>
</ol>

<p><font SIZE="2">The following characters are special to SGML. Use the given alternative
sequence to represent them:</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="162"><i><font SIZE="1">Character</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="336"><i><font SIZE="2">Escape sequence</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="162"><font SIZE="1">&lt; (less than)</font></td>
    <td WIDTH="336"><font SIZE="2">&amp;lt;</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><font SIZE="1">&gt; (greater than)</font></td>
    <td WIDTH="336"><font SIZE="2">&amp;gt;</font></td>
  </tr>
  <tr>
    <td WIDTH="162"><font SIZE="1">&amp; (ampersand)</font></td>
    <td WIDTH="336"><font SIZE="2">&amp;amp;</font> </td>
  </tr>
</table>

<p>For example, the string &quot;AT&amp;amp;T&quot; encodes &quot;AT&amp;T.&quot; </p>

<p>A special case applies in specific tags that can accept HTML-formatted strings, such as
e-mail records. These accept SGML marked section syntax to hide the HTML from the Open
Financial Exchange parser. You must prefix strings with &quot;&lt;![ CDATA [&quot;and
suffixed with&quot;]]&gt;.&quot; Within these bounds, treat the above characters literally
without an escape. See the Chapter 9 for an example. 

<ol>
  <li><a NAME="_Toc380493253"><font SIZE="5" FACE="Arial">Open Financial Exchange SGML
    Structure</font></a> </li>
  <li><a NAME="_Toc380493254"><font SIZE="4" FACE="Arial">Overview</font></a> </li>
</ol>

<p><font SIZE="2">Open Financial Exchange hierarchically organizes request and response
blocks:</font> </p>

<p><font SIZE="2">Top Level &lt;OFX&gt;<br>
Message Set and Version &lt;<i>XXX</i>MSGSVn&gt;<br>
Synchronization Wrappers &lt;YYYSYNCRQ&gt;, &lt;YYYSYNCRS&gt; <br>
Transaction Wrappers &lt;YYYTRNRQ&gt;, &lt;YYYTRNRS&gt;<br>
Specific requests and responses</font> </p>

<p><font SIZE="2">The following sections describe each of these levels.</font> 

<ol>
  <li><a NAME="_Toc380493255"><font SIZE="4" FACE="Arial">Top Level</font></a> </li>
</ol>

<p><font SIZE="2">An Open Financial Exchange request or response has the following
top-level form:</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="162"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="336"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="162"><font SIZE="1">&lt;<b>OFX</b>&gt;</font></td>
    <td WIDTH="336"><font SIZE="2">Opening tag</font></td>
  </tr>
  <tr>
    <td WIDTH="162"><font SIZE="1">... Open Financial Exchange requests or responses ...</font>
    </td>
    <td WIDTH="336"><font SIZE="2">0 or more transaction requests and responses inside
    appropriate message set aggregates</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><font SIZE="1">&lt;/<b>OFX</b>&gt;</font></td>
    <td WIDTH="336"><font SIZE="2">Closing tag for the Open Financial Exchange record</font> </td>
  </tr>
</table>

<p>This chapter specifies the order of requests and responses. </p>

<p>A single file can contain multiple &lt;OFX&gt; ... &lt;/OFX&gt; blocks. A typical use
of multiple blocks is to request in a single file information associated with different
users. 

<ol>
  <li><a NAME="_Toc380493256"><font SIZE="4" FACE="Arial">Messages</font></a> </li>
</ol>

<p><font SIZE="2">A message is the unit of work in Open Financial Exchange. It refers to a
request and response pair, and the status codes associated with that response. For
example, the message to download a bank statement consists of the request &lt;STMTRQ&gt;
and the response &lt;STMTRS&gt;. In addition, with the exception of the signon message,
each message includes a <i>transaction wrapper</i>. These aggregates add a transaction
unique ID &lt;TRNUID&gt;, and for responses, a &lt;STATUS&gt; aggregate, to the basic
request and response. </font></p>

<p><font SIZE="2">For messages subject to synchronization (see Chapter 6), a third layer
of aggregates is also part of a message definition: a synchronization request and
response. These add a token and, in some cases, other information to the transactions. </font></p>

<p><font SIZE="2">Open Financial Exchange uses the following naming where the <i>XXX</i>
message includes:</font> 

<ul>
  <li><font SIZE="2">Basic request &lt;<i>XXX</i><b>RQ</b>&gt; and response &lt;<i>XXX</i><b>RS</b>&gt;</font>
  </li>
  <li><font SIZE="2">Transaction wrapper &lt;<i>XXX</i><b>TRNRQ</b>&gt; and &lt;<i>XXX</i><b>TRNRS</b>&gt;</font>
  </li>
  <li><font SIZE="2">If needed, synchronization wrapper &lt;<i>XXX</i><b>SYNCRQ</b>&gt; and
    &lt;<i>XXX</i><b>SYNCRS</b>&gt;</font> </li>
</ul>

<p><font SIZE="2">In a few cases, a small number of related basic requests and responses
share a transaction and synchronization wrapper. The term message will still apply to each
request and response; only the naming scheme will not hold in those cases.</font> 

<ol>
  <li><a NAME="_Toc380493257"><font SIZE="4" FACE="Arial">Message Sets and Version Control</font></a>
  </li>
</ol>

<p><font SIZE="2">Message sets are collections of messages. Generally they form all or
part of what a user would consider a <i>service</i>, something for which they might have
signed up, such as &quot;banking.&quot; Message sets are the basis of version control,
routing, and security. They are also the basis for the required ordering in Open Financial
Exchange files.</font> </p>

<p><font SIZE="2">Within an Open Financial Exchange block, Open Financial Exchange
organizes messages by message set. A message set can appear at most once within an Open
Financial Exchange block. All messages from a message set must be from the same version of
that message set.</font> </p>
<script>mySlowFunction(5);</script>
<p><font SIZE="2">For each message set of <i>XXX</i> and version <i>n</i>, there exists an
aggregate named &lt;<i>XXX</i>MSGSV<i>n</i>&gt;. (Compare with &lt;<i>XXX</i>MSGSETV<i>n</i>&gt;
in Chapter 7.) All of the messages from that message set must be inside the appropriate
message set aggregate. In the following example, the Open Financial Exchange block
contains a signon request inside the signon message set, and two statement requests and a
transfer request inside the bank message set.</font> </p>

<pre>
<font SIZE="1">&lt;OFX&gt;
	&lt;SIGNONMSGSRQV1&gt;	&lt;!-- Signon message set --&gt;
		&lt;SONRQ&gt;				&lt;!-- Signon message --&gt;
		...
		&lt;/SONRQ&gt;
	&lt;/SIGNONMSGSRQV1&gt;

	&lt;BANKMSGSRQV1&gt;		&lt;!-- Banking message set --&gt;
		&lt;STMTTRNRQ&gt;		&lt;!-- Statement request --&gt;
		...
		&lt;/STMTTRNRQ&gt;
		&lt;STMTTRNRQ&gt;		&lt;!-- Another stmt request --&gt;
		...
		&lt;/STMTTRNRQ&gt;
		&lt;INTRATRNRQ&gt;		&lt;!-- Intra-bank transfer request --&gt;
		...
		&lt;/INTRATRNRQ&gt;
	&lt;/BANKMSGSRQV1&gt;
&lt;/OFX&gt;</font>
</pre>

<p><font SIZE="2">Message sets, if used at all, must appear in the following order:</font>

<ul>
  <li><font SIZE="2">Signon</font> </li>
  <li><font SIZE="2">Signup</font> </li>
  <li><font SIZE="2">Banking</font> </li>
  <li><font SIZE="2">Credit card statements</font> </li>
  <li><font SIZE="2">Investment statements</font> </li>
  <li><font SIZE="2">Interbank funds transfers</font> </li>
  <li><font SIZE="2">Wire funds transfers</font> </li>
  <li><font SIZE="2">Payments</font> </li>
  <li><font SIZE="2">General e-mail</font> </li>
  <li><font SIZE="2">Investment security list</font> </li>
  <li><font SIZE="2">FI Profile</font> </li>
</ul>

<p><font SIZE="2">The definition of each message set can further prescribe an order of its
messages within that message set.</font> 

<ol>
  <li><a NAME="_Toc380493258"><font SIZE="4" FACE="Arial">Transactions</font></a> </li>
</ol>

<p><font SIZE="2">Other than the signon message, each request is made as a transaction.
Transactions contain a client-assigned globally unique ID, optional client-supplied
pass-back data, and then the record for the specific request. A transaction similarly
wraps each response. The response transaction returns the client ID sent in the request,
along with a status message, the pass-back data if present, and the specific response
record. This technique allows a client to track responses against requests.</font> </p>

<p><font SIZE="2">The &lt;STATUS&gt; aggregate, defined in Chapter 3, provides feedback on
the processing of the request. If the &lt;SEVERITY&gt; of the status is ERROR, the server
provides no specific response record. Otherwise, the response will be complete even though
some warning might have occurred.</font> </p>

<p><font SIZE="2">Clients can send additional information in &lt;CLTCOOKIE&gt; that
servers will return in the response. This allows clients that do not maintain state, and
thus do not save TRNUIDs, to cause some additional descriptive information to be present
in the response. For example, a client might identify a request as relating to a user or a
spouse.</font> </p>

<p><font SIZE="2">In some countries some transactions require a customer-supplied
authorization number for each transaction. In those countries, the &lt;TAN&gt; element
provides the means to pass this information to servers. As Open Financial Exchange is
implemented in each country, the specification will define the specific requirements for
the use of &lt;TAN&gt; in each country.</font> </p>

<p><font SIZE="2">A typical request is as follows:</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;<b><i>XXX</i>TRNRQ&gt;</b></font></b> </td>
    <td WIDTH="366"><font SIZE="2">Transaction-request aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;TRNUID&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Client-assigned globally unique ID for this transaction <i>trnuid</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;CLTCOOKIE&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Data to be echoed in the transaction response <i>A-32</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;TAN&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Transaction authorization number; used in some countries
    with some types of transactions. Country-specific documentation will define messages that
    require a TAN, <i>A-80</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">specific request</font></td>
    <td WIDTH="366"><font SIZE="2">Aggregate for the specific request</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/<b><i>XXX</i>TRNRQ&gt;</b></font></b> </td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<p>A typical response is as follows:<br>
</p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;<b><i>XXX</i>TRNRS&gt;</b></font></b> </td>
    <td WIDTH="366"><font SIZE="2">Transaction-response aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;TRNUID&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Client-assigned globally unique ID for this transaction, <i>trnuid</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;CLTCOOKIE&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Client-provided data, <b>REQUIRED</b> if provided in
    request, <i>A-32</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;STATUS&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Status aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/STATUS&gt;</font></b> </td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">response record</font></td>
    <td WIDTH="366"><font SIZE="2">Aggregate for the specific response</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/<b><i>XXX</i>TRNRS&gt;</b></font></b> </td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493259"><font SIZE="5" FACE="Arial">The Signon Message Set</font></a> </li>
</ol>

<p><font SIZE="2">The Signon message set includes the signon message and the PIN change
message, and must appear in that order. The &lt;SIGNONMSGSRQV1&gt; and
&lt;SIGNONMSGSRSV1&gt; aggregates wrap the message.</font> 

<ol>
  <li><a NAME="_Toc380493260"><font SIZE="4" FACE="Arial">Signon &lt;SONRQ&gt; &lt;SONRS&gt;</font></a>
  </li>
</ol>

<p><font SIZE="2">The signon record identifies and authenticates a user to an FI. It also
includes information about the application making the request, because some services might
be appropriate only for certain clients. Every Open Financial Exchange request contains
exactly one &lt;SONRQ&gt;. Every response must contain exactly one &lt;SONRS&gt; record. </font></p>

<p><font SIZE="2">Use of Open Financial Exchange presumes that FIs authenticate each
customer and then give the customer access to one or more accounts or services. If
passwords are specific to individual services or accounts, a separate Open Financial
Exchange request will be made for each distinct user ID or password required. This will
not necessarily be in a manner visible to the user. Note that some situations, such as
joint accounts or business accounts, will have multiple user IDs and multiple passwords
that can access the same account.</font> </p>

<p><font SIZE="2">FIs assign user IDs for the customer. It can be the customer's social
security number, but the client will not make any assumptions about the syntax of the ID,
add check-digits, or do similar processing.</font> </p>

<p><font SIZE="2">To improve server efficiency in handling a series of Open Financial
Exchange request files sent over a short period of time, clients can request that a server
return a &lt;USERKEY&gt; in the signon response. If the server provide a user key, clients
will send the &lt;USERKEY&gt; in instead of the user ID and password in subsequent
sessions, until the &lt;USERKEY&gt; expires. This allows servers to authenticate
subsequent requests more quickly.</font> </p>

<p><font SIZE="2">The client returns &lt;SESSCOOKIE&gt; if it sent one in a previous
&lt;SONRS&gt;. Servers can use this value to track client usage but cannot assume that all
requests come from a single client, nor can they deny service if they did not expect the
returned cookie. Use of a backup file, for example, would lead to an unexpected
&lt;SESSCOOKIE&gt; value that should nevertheless not stop a user from connecting.</font> </p>

<p><font SIZE="2">Servers can request that a consumer change his or her password by
returning status code 15000. Servers should keep in mind that only one status code can be
returned. If the current signon response status should be 15500 (invalid ID or password),
the request to change password will need to wait until an otherwise successful signon is
achieved.</font> 

<ol>
  <li><font SIZE="2" FACE="Arial">Record Request &lt;SONRQ&gt;</font> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><font SIZE="2">Tag</font></td>
    <td BGCOLOR="#000000" WIDTH="366"><font SIZE="2">Description</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;SONRQ&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Record- request aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;<b>DTCLIENT</b>&gt;</font> </td>
    <td WIDTH="366"><font SIZE="2">Date and time of the request from the client computer, <i>datetime</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;USERID&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">User identification string. Use &lt;USERID&gt; &amp;
    &lt;USERPASS&gt;, or &lt;USERKEY&gt;, but not both; <i>A-32</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;USERPASS&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">User password on server - either &lt;USERID&gt; &amp;
    &lt;USERPASS&gt; are used, or &lt;USERKEY&gt;, but not both;<i> A-32</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;USERKEY&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Login using previously authenticated context - use
    &lt;USERID&gt; &amp; &lt;USERPASS&gt;, or &lt;USERKEY&gt;, but not both; <i>A-64</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;GENUSERKEY&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Request server to return a USERKEY for future use, <i>Boolean</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;LANGUAGE&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Requested language for text responses, <i>language</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;SESSCOOKIE&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Session cookie, value received in previous &lt;SONRS&gt;,
    not sent if first login or if none sent by FI <i>A-1000</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;FI&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Financial-Institution-identification aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;/FI&gt;</font></td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;APPID&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">ID of client application, <i>A-5</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;APPVER&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Version of client application, <i>N-4</i> (6.00 encoded as
    0600)</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/SONRQ&gt;</font></b></td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><font SIZE="2" FACE="Arial">Response &lt;SONRS&gt;</font> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;SONRS&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Record-response aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;STATUS&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Status aggregate, see list of possible code values</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;DTSERVER&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Date and time of the server response, <i>datetime</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;USERKEY&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Use user key that instead of USERID and USERPASS for
    subsequent requests. TSKEYEXPIRE can limit lifetime</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;TSKEYEXPIRE&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Date and time that USERKEY expires</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1"><b>&lt;LANGUAGE</b>&gt;</font> </td>
    <td WIDTH="366"><font SIZE="2">Language used in text responses, <i>language</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;DTPROFUP&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Date and time of last update to profile information for any
    service supported by this FI (see Chapter 7), <i>datetime</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;DTACCTUP&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Date and time of last update to account information (see
    Chapter 8), <i>datetime</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;FI&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Financial-Institution-identification aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;/FI&gt;</font></td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;SESSCOOKIE&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Session cookie that the client should return on the next
    &lt;SONRQ&gt; <br>
    <i>A-1000</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/SONRS&gt;</font></b></td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<p>List of status code values for the &lt;CODE&gt; element of &lt;STATUS&gt;: <br>
</p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="60"><i><font SIZE="1">Value</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="438"><i><font SIZE="2">Meaning</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="60"><font SIZE="1">0</font></td>
    <td WIDTH="438"><font SIZE="2">Success (INFO)</font> </td>
  </tr>
  <tr>
    <td WIDTH="60"><font SIZE="1">2000</font></td>
    <td WIDTH="438"><font SIZE="2">General error (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="60"><font SIZE="1">15000</font></td>
    <td WIDTH="438"><font SIZE="2">Must change PIN (INFO)</font> </td>
  </tr>
  <tr>
    <td WIDTH="60"><font SIZE="1">15500</font></td>
    <td WIDTH="438"><font SIZE="2">Signon (for example, user ID or password) invalid (ERROR)</font>
    </td>
  </tr>
  <tr>
    <td WIDTH="60"><font SIZE="1">15501</font></td>
    <td WIDTH="438"><font SIZE="2">Customer account already in use (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="60"><font SIZE="1">15502</font></td>
    <td WIDTH="438"><font SIZE="2">PIN Lockout (ERROR)</font> </td>
  </tr>
</table>

<ol>
  <li><font SIZE="2" FACE="Arial">Financial Institution ID &lt;FI&gt;</font> </li>
</ol>

<p><font SIZE="2">Some service providers support multiple FIs, and assign each FI an ID.
The signon allows clients to pass this information along, so that providers will know to
which FI the user is actually doing a signon.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;FI&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">FI-record aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;ORG&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Organization defining this FI name space, <i>A-32</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;FID&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Financial Institution ID (unique within &lt;ORG&gt;), <i>A-32</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/FI&gt;</font></b></td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493261"><font SIZE="4" FACE="Arial">PIN Change &lt;PINCHRQ&gt;
    &lt;PINCHRS&gt;</font></a> </li>
</ol>

<p><font SIZE="2">The signon sends a request to change a customer password as a separate
request. The transaction request &lt;PINCHTRNRQ&gt; aggregate contains &lt;PINCHRQ&gt;.
Responses are also inside transaction responses &lt;PINCHTRNRS&gt;. </font></p>

<p><font SIZE="2">Password changes pose a special problem for error recovery. If the
client does not receive a response, it does not know whether the password change was
successful or not. Open Financial Exchange recommends that servers accept either the old
password or the new password on the connection following the one containing a password
change. The password used becomes the new password.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;PINCHRQ&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">PIN-change-request aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;USERID&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">User identification string. Often a social security number,
    but if so, does not include any check digits, <i>A-32</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;NEWUSERPASS&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">New user password, <i>A-32</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/PINCHRQ&gt;</font></b> </td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;PINCHRS&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">PIN-change-response aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;USERID&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">User identification string. Often a social security number,
    but if so, does not include any check digits, <i>A-32</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;DTCHANGED&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Date and time the password was changed, <i>datetime</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/PINCHRS&gt;</font></b> </td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><font SIZE="2" FACE="Arial">Status Code Values for the &lt;CODE&gt; Element of
    &lt;STATUS&gt;</font> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="60"><i><font SIZE="1">Value</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="438"><i><font SIZE="2">Meaning</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="60"><font SIZE="1">0</font></td>
    <td WIDTH="438"><font SIZE="2">Success (INFO)</font> </td>
  </tr>
  <tr>
    <td WIDTH="60"><font SIZE="1">2000</font></td>
    <td WIDTH="438"><font SIZE="2">General error (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="60"><font SIZE="1">15503</font></td>
    <td WIDTH="438"><font SIZE="2">Could not change PIN (ERROR)</font> </td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493262"><font SIZE="4" FACE="Arial">Examples</font></a> </li>
</ol>

<p><b><font SIZE="2">User requests a password change: </font></b></p>

<pre>
<font SIZE="2">&lt;PINCHTRNRQ&gt;
	&lt;TRNUID&gt;888
	&lt;PINCHRQ&gt;
		&lt;USERID&gt;123456789
		&lt;NEWUSERPASS&gt;5321
	&lt;/PINCHRQ&gt;
&lt;/PINCHTRNRQ&gt;</font>
</pre>

<p><b><font SIZE="2">The server responds with: </font></b></p>

<pre>
<font SIZE="1">&lt;PINCHTRNRS&gt;
	&lt;TRNUID&gt;888
	&lt;STATUS&gt;
		&lt;CODE&gt;0
		&lt;SEVERITY&gt;INFO
	&lt;/STATUS&gt;
	&lt;PINCHRS&gt;
		&lt;USERID&gt;123456789
	&lt;/PINCHRS&gt;
&lt;/PINCHTRNRS&gt;</font>
</pre>

<ol>
  <li><a NAME="_Toc380493263"><font SIZE="5" FACE="Arial">External Data Support</font></a> </li>
</ol>

<p><font SIZE="2">Some data, such as binary data, cannot be easily sent directly within
SGML. For these situations, the specification will define a tag that contains a reference
to some external data. The way that clients pick up the external data depends on the
transport used. For the HTTP-based transport described in this document, servers can send
the data in one of two ways:</font> 

<ul>
  <li><font SIZE="2">Send the same response, using multi-part MIME types to separate the
    response into basic <br>
    Open Financial Exchange and one or more external data files</font> </li>
  <li><font SIZE="2">Client can make a separate HTTP get against the supplied URL, if it
    really needs the data </font></li>
</ul>

<p><font SIZE="2">For example, to retrieve a logo, a &lt;GETMIMERS&gt; might answer a
&lt;GETMIMERQ&gt; as follows: </font></p>

<pre>
<font SIZE="1">&lt;GETMIMERS&gt;
	&lt;URL&gt;https://www.fi.com/xxx/yyy/zzz.html
&lt;/GETMIMERS&gt;</font>
</pre>

<p><font SIZE="2">If the file sent includes the same response using multi-part MIME,
clients will assume it has the local file, zzz.jpg.</font> 

<ol>
  <li><a NAME="_Toc380493264"><font SIZE="5" FACE="Arial">Extensions to Open Financial
    Exchange</font></a> </li>
</ol>

<p><font SIZE="2">An organization that provides a customized client and server that
communicate by means of <br>
Open Financial Exchange might wish to add new requests and responses or even specific
elements to existing requests and responses. To ensure that each organization can extend
the specification without the risk of conflict, Open Financial Exchange defines a style of
tag naming that lets each organization have its own name space.</font> </p>

<p><font SIZE="2">Organizations can register a specific tag name prefix. (The specific
procedure or organization to manage this registration will be detailed at a later time.)
If an organization registers &quot;ABC,&quot; then they can safely add new tags named
&lt;ABC.SOMETHING&gt; without</font> 

<ul>
  <li><font SIZE="2">Colliding with another party wishing to extend the specification</font> </li>
  <li><font SIZE="2">Confusing a client or server that does not support the extension</font> </li>
</ul>

<p><font SIZE="2">The extensions are not considered proprietary. An organization is free
to publish their extensions and encourage client and server implementers to support them.</font>
</p>

<p><font SIZE="2">All tag names that do not contain a period (.) are reserved for use in
future versions of the core <br>
Open Financial Exchange specification.<br>
</font>

<ol>
  <li><a NAME="_Toc380493265"><font SIZE="6" FACE="Arial">Common Aggregates, Elements, and
    Data Types</font></a> </li>
  <li><a NAME="_Toc380493266"><font SIZE="5" FACE="Arial">Common Aggregates</font></a> </li>
</ol>

<p><font SIZE="2">This section describes aggregates used in more than one service of Open
Financial Exchange (for example, investments and payments).</font> 

<ol>
  <li><a NAME="_Toc380493267"><font SIZE="4" FACE="Arial">Identifying Financial Institutions
    and Accounts</font></a> </li>
</ol>

<p><font SIZE="2">Open Financial Exchange does not provide a universal space for
identifying financial institutions, accounts, or types of accounts. The way to identify an
FI and an account at that FI depends on the service. For information about
service-specific ID aggregates, see Chapters 11, 12, and 13 on banking, payments, and
investments.</font> 

<ol>
  <li><a NAME="_Toc380493268"><font SIZE="4" FACE="Arial">Balance Records &lt;BAL&gt;</font></a>
  </li>
</ol>

<p><font SIZE="2">Several responses allow FIs to send an arbitrary set of balance
information as part of a response, for example a bank statement download. FIs might want
to send information on outstanding balances, payment dates, interest rates, and so forth.
Balances can report the date the given balance reflects in &lt;DTASOF&gt;.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="300"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;BAL&gt;</font></b></td>
    <td WIDTH="300"><font SIZE="2">Balance-response aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;NAME&gt;</font></b></td>
    <td WIDTH="300"><font SIZE="2">Balance name, <i>A-20</i></font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;DESC&gt;</font></b></td>
    <td WIDTH="300"><font SIZE="2">Balance description, <i>A-80</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;BALTYPE&gt;</font></b> </td>
    <td WIDTH="300"><font SIZE="2">Balance type. <br>
    DOLLAR = dollar (value formatted DDDDcc)<br>
    PERCENT = percentage (value formatted XXXX.YYYY)<br>
    NUMBER = number (value formatted as is)</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;VALUE&gt;</font></b></td>
    <td WIDTH="300"><font SIZE="2">Balance value.<br>
    Interpretation depends on &lt;BALTYPE&gt; field, <i>N-20</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1" FACE="Arial">&lt;CURRENCY&gt;</font> </td>
    <td WIDTH="300"><font SIZE="2">If dollar formatting, can optionally include currency</font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1" FACE="Arial">&lt;DTASOF&gt;</font> </td>
    <td WIDTH="300"><font SIZE="2">Effective date of the given balance, <i>datetime</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/BAL&gt;</font></b></td>
    <td WIDTH="300">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493269"><font SIZE="4" FACE="Arial">Error Reporting &lt;STATUS&gt;</font></a>
  </li>
</ol>

<p><font SIZE="2">To provide as much feedback as possible to clients and their users, Open
Financial Exchange defines a &lt;STATUS&gt; aggregate. The most important element is the
code that identifies the error. Each response defines the codes it uses. Codes 0 through
2999 have common meanings in all Open Financial Exchange transactions. Codes from 3000 and
up have meanings specific to each transaction.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="300"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;STATUS&gt;</font></b></td>
    <td WIDTH="300"><font SIZE="2">Error-reporting aggregate.</font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;CODE&gt;</font></b></td>
    <td WIDTH="300"><font SIZE="2">Error code, <i>N-6</i></font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;SEVERITY&gt;</font></b> </td>
    <td WIDTH="300"><font SIZE="2">Severity of the error: <br>
    INFO = Informational only<br>
    WARN = Some problem with the request occurred but valid response still present<br>
    ERROR = A problem severe enough that response could not be made</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1" FACE="Arial">&lt;MESSAGE&gt;</font> </td>
    <td WIDTH="300"><font SIZE="2">A textual explanation from the FI. Note that clients will
    generally have messages of their own for each error ID. Use this tag only to provide more
    details or for the General errors.</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/STATUS&gt;</font></b></td>
    <td WIDTH="300">&nbsp;</td>
  </tr>
</table>

<p>&nbsp;</p>

<p><img src="" width="70" height="70" alt=" (4356 bytes)"><br>
stadyn_image6</p>

<p><img src="" width="223" height="72" alt=" (1702 bytes)"><br>
stadyn_image7</p>

<p>For general errors, the server can respond with one of the following &lt;CODE&gt;
values. However, not all codes are possible in a specific context. </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Code</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Meaning</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">0</font></td>
    <td WIDTH="366"><font SIZE="2">Success (INFO)</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">2000</font></td>
    <td WIDTH="366"><font SIZE="2">General error (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">2021</font></td>
    <td WIDTH="366"><font SIZE="2">Unsupported version (ERROR)</font> </td>
  </tr>
</table>

<p><i><b>NOTE:</b> Clients will generally have error messages based on &lt;CODE&gt;.
Therefore, do not use &lt;MESSAGE&gt; to replace that text. Use &lt;MESSAGE&gt; only to
explain an error not well described by one of the defined CODEs, or to provide some
additional information.</i> 

<ol>
  <li><a NAME="_Toc380493270"><font SIZE="5" FACE="Arial">Common Elements</font></a> </li>
</ol>

<p><font SIZE="2">This section defines elements used in several services of Open Financial
Exchange. The format of the value is either alphanumeric (A-<i>n</i>)<i> </i>or numeric
(N-<i>n</i>) with a maximum length <i>n</i>; or as a named type. Section 3.3 describes the
named types.</font> 

<ol>
  <li><a NAME="_Toc380493271"><font SIZE="4" FACE="Arial">Financial Institution Transaction ID
    &lt;FITID&gt;</font></a> </li>
</ol>

<p><font SIZE="2"><b>Format: </b><i>A-255</i></font> </p>

<p><font SIZE="2">An FI assigns an &lt;FITID&gt; to uniquely identify a transaction. Its
primary purpose is to allow a client to detect duplicate responses. Open Financial
Exchange intends &lt;FITID&gt; for use in statement download applications, where every
transaction requires a unique ID; not just those that are client-originated or
server-originated.</font> </p>

<p><font SIZE="2">FITIDs must be unique within the scope of the requested transactions
(that is, within an account) but need not be sequential or even increasing. Clients should
be aware that FITIDs are not unique across FIs. If a client performs the same type of
request within the same scope at two different FIs, clients will need to use FI + account
+ &lt;FITID&gt; as a unique key in a client database.</font> </p>

<p><font SIZE="2"><b>Usage:</b> Bank statement download, investment statement download</font>

<ol>
  <li><a NAME="_Toc380493272"><font SIZE="4" FACE="Arial">Server-Assigned ID &lt;SRVRTID&gt;</font></a>
  </li>
</ol>

<p><font SIZE="2"><b>Format:</b> <i>A-10</i></font> </p>

<p><font SIZE="2">A &lt;SRVRTID&gt; is a server-assigned ID. It should remain constant
throughout the lifetime of the object on the server. The client will consider the SRVRTID
as its &quot;receipt&quot; or confirmation and will use this ID in any subsequent requests
to change, delete, or inquire about this object. </font></p>

<p><font SIZE="2">Where the context allows, it is possible for a server to use the same <i>value
</i>for a given server object for both &lt;SRVRTID&gt; and &lt;FITID&gt;, but the client
will not know this. SRVRTIDs need be unique only within the scope of the requests and
responses they apply to, such as an account number. Like &lt;FITID&gt;, a &lt;SRVRTID&gt;
is not unique across FIs and clients might need to use FI + &lt;SRVRTID&gt; if a client
requires a unique key.</font> </p>

<p><font SIZE="2"><b>Usage:</b> Payments, Banking</font> 

<ol>
  <li><a NAME="_Toc380493273"><font SIZE="4" FACE="Arial">Client-Assigned Transaction UID
    &lt;TRNUID&gt;</font></a> </li>
</ol>

<p><font SIZE="2"><b>Format:</b> <i>A-36</i></font> </p>

<p><font SIZE="2">Open Financial Exchange uses TRNUIDs to identify transactions,
specifically &lt;<i>XXX</i>TRNRQ&gt;. Clients expect a server to return the same
&lt;TRNUID&gt; in the corresponding response and can use this to match up requests and
responses. Servers can use TRNUIDs to reject duplicate requests. Because multiple clients
might be generating requests to the same server, transaction IDs need to be unique across
clients. Thus, &lt;TRNUID&gt; must be a globally unique ID.</font> </p>

<p><font SIZE="2">The Open Software Foundation Distributed Computing Environment standards
specify a 36-character hexadecimal encoding of a 128-bit number and an algorithm to
generate it. Clients are free to use their own algorithm, to use smaller TRNUIDs, or to
relax the uniqueness requirements if in their particular application it makes sense.
However, it is <b>RECOMMENDED</b> that clients allow for the full 36 characters in
responses to work better with other clients.</font> </p>

<p><font SIZE="2"><b>Usage:</b> All services</font> 

<ol>
  <li><a NAME="_Toc380493274"><font SIZE="4" FACE="Arial">Token &lt;TOKEN&gt;</font></a> </li>
</ol>

<p><font SIZE="2"><b>Format:</b> <i>A-10</i></font> </p>

<p><font SIZE="2">Open Financial Exchange uses <b>&lt;</b>TOKEN&gt; as part of data
synchronization requests to identify the point in history that the client has already
received data, and in responses to identify the server's current end of history. See
Chapter 6, &quot;Data Synchronization,&quot; for more information.</font> </p>

<p><font SIZE="2">&lt;TOKEN&gt; is unique within an FI and the scope of the
synchronization request. For example, if the synchronization request includes an account
ID, the &lt;TOKEN&gt; needs be unique only within an account. Servers are free to use a
&lt;TOKEN&gt; that is unique across the entire FI. Clients must save separate
&lt;TOKEN&gt;s for each account, FI, and type of synchronization request.</font> </p>

<p><font SIZE="2"><b>Usage:</b> All synchronization requests and responses</font> 

<ol>
  <li><a NAME="_Toc380493275"><font SIZE="4" FACE="Arial">Transaction Amount &lt;TRNAMT&gt;</font></a>
  </li>
</ol>

<p><font SIZE="2"><b>Format:</b> <i>Amount</i></font> </p>

<p><font SIZE="2">Open Financial Exchange uses &lt;TRNAMT&gt; in any request or response
that reports the total amount of an individual transaction.</font> </p>

<p><font SIZE="2"><b>Usage:</b> Bank statement download, investment statement download,
payments</font> 

<ol>
  <li><a NAME="_Toc380493276"><font SIZE="4" FACE="Arial">Memo &lt;MEMO&gt;</font></a> </li>
</ol>

<p><font SIZE="2"><b>Format:</b> <i>A-255</i></font> </p>

<p><font SIZE="2">A &lt;MEMO&gt; provides additional information about a transaction.</font>
</p>

<p><font SIZE="2"><b>Usage:</b> Bank statement download, investment statement download,
payments, transfers</font> 

<ol>
  <li><font SIZE="4" FACE="Arial"><a NAME="_Toc380493277">Date Start and Date End
    &lt;DTSTART&gt;</a> &lt;DTEND&gt;</font> </li>
</ol>

<p><font SIZE="2"><b>Format:</b> <i>Datetime</i></font> </p>

<p><font SIZE="2">Open Financial Exchange uses these tags in requests to provide guidance
to the FI about the range of response that is desired. It also uses them in responses to
let clients know what the FI was actually able to produce.</font> </p>

<p><font SIZE="2">In requests, the following rules apply:</font> 

<ul>
  <li><font SIZE="2">If &lt;DTSTART&gt; is absent, the client is requesting all available
    history (up to the &lt;DTEND&gt;, if specified). Otherwise, it indicates the <i>inclusive</i>
    date and time in history where the client expects servers to start sending information.</font>
  </li>
  <li><font SIZE="2">If &lt;DTEND&gt; is absent, the client is requesting all available
    history (starting from &lt;DTSTART&gt;, if specified). Otherwise, it indicates the <i>exclusive</i>
    date and time in history where the client expects servers to stop sending information.</font>
  </li>
</ul>

<p><font SIZE="2">In responses, the following rules apply:</font> 

<ul>
  <li><font SIZE="2">&lt;DTSTART&gt; is the date and time where the server began <i>looking</i>
    for information, not necessarily the date of the earliest returned information. If the
    response &lt;DTSTART&gt; is later than the requested &lt;DTSTART&gt;, clients can infer
    that the user has not signed on frequently enough to ensure that the client has retrieved
    all information. If the user has been calling frequently enough, &lt;DTSTART&gt; in the
    response will match &lt;DTSTART&gt; in the request.</font> </li>
  <li><font SIZE="2">&lt;DTEND&gt; is the date and time that, if used by the client as the
    next requested &lt;DTSTART&gt;, it would pick up exactly where the current response left
    off. It is the <i>exclusive</i> date and time in history where the server stopped <i>looking</i>
    for information, based on the request &lt;DTEND&gt; rules. </font></li>
</ul>

<p><font SIZE="2">In all cases, servers are <b>REQUIRED</b> to use a &quot;system add
datetime&quot; as the basis for deciding which details match the requested date range. For
example, if an FI posts a transaction dated Jan 3 to a user's account on Jan 5, and a
client connects on Jan 4 and again on Jan 6, the server is <b>REQUIRED</b> to return that
Jan 3 dated transaction to the client when it calls on Jan 6. </font></p>

<p><font SIZE="2"><b>Usage:</b> Bank statement download, investment statement download</font>

<ol>
  <li><a NAME="_Toc380493278"><font SIZE="5" FACE="Arial">Common data types</font></a> </li>
  <li><a NAME="_Toc380493279"><font SIZE="4" FACE="Arial">Dates and Times</font></a> </li>
  <li><font SIZE="2" FACE="Arial">Basic Format</font> </li>
</ol>

<p><font SIZE="2">There is one format for representing dates, times, and time zones. The
complete form is:</font> </p>

<p><font SIZE="2">YYYYMMDDHHMMSS.XXX[<i>gmt offset</i>:<i>tz name</i>]</font> </p>

<p><font SIZE="2">For example, &quot;19961005132200.1234[-5:EST]&quot; represents October
5, 1996, at 1:22 and 124 milliseconds p.m., in Eastern Standard Time. This is the same as
6:22 p.m. Greenwich Mean Time (GMT).</font> </p>

<p><font SIZE="2">Tags specified as type <i>date </i>and generally starting with the
letters &quot;DT&quot; will accept a fully formatted date-time-timezone as specified
above. They will also accept values with fields omitted from the right. They assume the
following defaults if a field is missing:</font> 

<ul>
  <li><font SIZE="2">YYYYMMDD: 12:00 midnight (the start of the day), GMT</font> </li>
  <li><font SIZE="2">YYYYMMDDHHMMSS: GMT</font> </li>
  <li><font SIZE="2">YYYYMMDDHHMMSS.XXX: GMT</font> </li>
  <li><font SIZE="2">YYYYMMDDHHMMSS.XXX[-0500:EST]: Fully qualified</font> </li>
</ul>

<p><font SIZE="2">Open Financial Exchange identifies elements that require a time as
having type <i>timestamp </i>and their tag name will start with the prefix TS. The
timezone and milliseconds are still optional, and will default to GMT.</font> </p>

<p><font SIZE="2">Take care when specifying an ending date without a time. If the last
transaction returned for a bank statement download was Jan 5 1996 10:46 a.m. and if the
&lt;DTEND&gt; was given as just Jan 5, the transactions on Jan 5 would be resent. If
results are only available daily, then just using dates and not times will work correctly.
</font></p>

<p><font SIZE="2"><i><b>NOTE:</b> Open Financial Exchange does not require servers or
clients to use the full precision specified. However, they are <i><b>REQUIRED</b> to
accept any of these forms without complaint.</i></i></font> </p>

<p><font SIZE="2">Some services extend the general notion of a <i>date</i> by adding
special values, such as &quot;TODAY.&quot; These special values are called &quot;smart
dates.&quot; Specific requests indicate when to use these extra values, and list the tag
as having a special data type.</font> 

<ol>
  <li><font SIZE="2" FACE="Arial">Time Zone Issues</font> </li>
</ol>

<p><font SIZE="2">Several issues arise when a customer and the FI are not in the same time
zone, or when a customer moves a computer into new time zones. In addition, it is
generally unsafe to assume that computer users have correctly set their time or timezone.</font>
</p>

<p><font SIZE="2">Although most transactions are not sensitive to the exact time, they
often are sensitive to the date. In some cases, time zone errors lead to actions occurring
on a different date than intended by the customer. For this reason, servers should always
use a complete local time plus GMT offset in any datetime values in a response. If a
customer's request is for 5 p.m. EST, and a server in Europe responds with 1 a.m. MET the
next day, a smart client can choose to warn the customer about the date shift.</font> </p>

<p><font SIZE="2">Clients that maintain local state, especially of long-lived server
objects, should be careful how they store datetime values. If a customer initiates a
repeating transaction for 5 p.m. EST, then moves to a new time zone, the customer might
have intended that the transaction remain 5 p.m. in the new local time, requiring a change
request to be sent to the server. If, however, they intended it to remain fixed in server
time, this would require a change in the local time stored in the client.</font> 

<ol>
  <li><a NAME="_Toc380493280"><font SIZE="4" FACE="Arial">Amounts, Prices, and Quantities</font></a>
  </li>
  <li><font SIZE="2" FACE="Arial">Positive and Negative Signs</font> </li>
</ol>

<p><font SIZE="2">Unless otherwise noted in the specification, Open Financial Exchange
always signs amounts and quantities from the perspective of the customer. Some typically
negative amounts:</font> 

<ul>
  <li><font SIZE="2">Investment buy amount, investment sell quantity</font> </li>
  <li><font SIZE="2">Bank statement debit amounts, checks, fees</font> </li>
  <li><font SIZE="2">Credit card purchases</font> </li>
  <li><font SIZE="2">Margin balance (unless the FI owes the client money)</font> </li>
</ul>

<p><font SIZE="2">Some typically positive amounts:</font> 

<ul>
  <li><font SIZE="2">Investment sell amount, investment buy quantity</font> </li>
  <li><font SIZE="2">Bank statement credits</font> </li>
  <li><font SIZE="2">Credit card payments</font> </li>
  <li><font SIZE="2">Ledger balance (unless the account is overdrawn)</font> </li>
</ul>

<p><font SIZE="2"><i>Amount: </i>All amount-valued tags are sent with a decimal point or
comma, as in &quot;XXXX.XX.&quot; There should not be any punctuation separating
thousands, millions, and so forth. The maximum value accepted depends on the client.</font>
</p>

<p><font SIZE="2"><i>Quantity: </i>Use decimal notation.</font> </p>

<p><font SIZE="2"><i>Unitprice: </i>Use decimal notation. Unless specifically noted,
prices should always be positive.</font> </p>

<p><font SIZE="2"><i>Rate: </i>Use decimal notation, with the rate specified out of 100%.
For example, 5.2 is 5.2%.</font> </p>

<p><font SIZE="2">Some services define special values, such as INFLATION, which you can
use instead of a designated value. Open Financial Exchange refers to these as &quot;smart
types,&quot; and identifies them in the specification.</font> 

<ol>
  <li><a NAME="_Toc380493281"><font SIZE="4" FACE="Arial">Language</font></a> </li>
</ol>

<p><font SIZE="2">Open Financial Exchange identifies human-readable language-for such
things as status messages and e-mail-with a three-letter code based on ISO-639.</font> 

<ol>
  <li><a NAME="_Toc380493282"><font SIZE="4" FACE="Arial">Basic data types</font></a> </li>
</ol>

<p><font SIZE="2"><i>Boolean: </i>Y = yes or true, N = no or false.</font> </p>

<p><font SIZE="2"><i>URL: </i>String form of a World Wide Web Uniform Resource Location.
It should be fully qualified including protocol, host, and path.</font> 

<ol>
  <li><a NAME="_Toc380493283"><font SIZE="6" FACE="Arial">Security</font></a> </li>
  <li><a NAME="_Toc380493284"><font SIZE="5" FACE="Arial">Security Solutions</font></a> </li>
</ol>

<p><font SIZE="2">Open Financial Exchange carries financial information over the Internet
in such a way to provide privacy, message integrity, and authentication for applications
at the appropriate level. Each service within Open Financial Exchange requires a certain
level of security. Online banking and payments require strong secrecy, whereas stock
quotations consist of publicly available information and consequently have a much weaker
secrecy requirement.</font> </p>

<p><font SIZE="2">Some Internet protocols, such as HTTPS (which uses Secure Socket Layer
version 3, SSLv3), provide channel-level security. When the security requirement exceeds
that provided by the channel, you must use an application-level protocol.</font> </p>

<p><a NAME="_Toc371763498"><font SIZE="2">To address these various needs, Open Financial
Exchange allows a range of security solutions. Open Financial Exchange 1.0 supports online
banking and payment functions for which strong channel security is currently appropriate.
Future releases will support a wider array of services, some of which will require more
elaborate trust models. Application-level protection will secure the latter.</font></a> </p>

<p><font SIZE="2">Open Financial Exchange security properties include:</font> 

<ul>
  <li><font SIZE="2">SSL - protects information during transmission over the Internet between
    a customer and an FI </font></li>
  <li><font SIZE="2">Application layer security - encrypts and formats messages using RSA Data
    Security PKCS#7 techniques </font></li>
  <li><font SIZE="2">New cryptographic options and enhancements when available - will enhance
    Open Financial Exchange to provide these facilities </font></li>
</ul>

<ol>
  <li><a NAME="_Toc380493285"><font SIZE="4" FACE="Arial">Determining Security Levels
    &lt;OFXSEC&gt; &lt;TRANSPSEC&gt;</font></a> </li>
</ol>

<p><font SIZE="2">Two elements in the FI profile, &lt;OFXSEC&gt; and &lt;TRANSPSEC&gt;,
contain the security level a client should use to communicate with a server.</font> </p>

<p><font SIZE="2">The valid values for &lt;OFXSEC&gt; are as follows:</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="180"><i><font SIZE="1">Type</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="318"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1">NONE</font></td>
    <td WIDTH="318"><font SIZE="2">No application level security</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1">APPSEC</font></td>
    <td WIDTH="318"><font SIZE="2">Use application level security</font> </td>
  </tr>
</table>

<p>The &lt;TRANSPSEC&gt; element value is Boolean. If the value is YES, use channel-level
security. 

<ol>
  <li><a NAME="_Toc380493286"><font SIZE="5" FACE="Arial">Channel-Level Security</font></a> </li>
</ol>

<p><font SIZE="2">Secure Socket Layer version 3 (SSLv3) provides channel-level security in
Open Financial Exchange. SSLv3 provides confidentiality, message integrity, and implicit
authentication. In Open Financial Exchange 1.0, channel-level security using SSLv3 is the
primary form of security.</font> 

<ol>
  <li><font SIZE="4" FACE="Arial"><a NAME="_Toc380493287">Security Requirements</a> </font></li>
</ol>

<p><font SIZE="2">Open Financial Exchange provides a method to exchange financial
information over public networks. This necessitates strong security facilities and careful
protocol design. The most commonly used facility, and trusted method for accomplishing
many of these goals is SSL. The following sub-sections describe the most prominent
requirements for security and how Secure Socket Layer (SSL) addresses these.</font> 

<ol>
  <li><font SIZE="2" FACE="Arial">Privacy, Authentication, and Message Integrity</font> </li>
</ol>

<p><font SIZE="2">SSL provides a range of strong encryption methods for insuring
confidentiality, and strong measures to insure that messages are not altered as they
propagate over the Internet. User authentication is usually addressed at the application
layer, not within SSL. Servers are configured with public key certificates that client
application software verifies. This provides some measure of server authentication.
Testing certificate revocation lists is not commonly performed. However, as these
facilities emerge, client software will be written to support this need. </font>

<ol>
  <li><font SIZE="2" FACE="Arial">Facilities for Authorization</font> </li>
</ol>

<p><font SIZE="2">Open Financial Exchange messages typically provide user ID and password
so that a service provider can authenticate the user. Once a system authenticates a user,
the service provider must insure that the user is authorized to perform the requested
actions. For example, the service provider must decide if the specified user is authorized
to perform a transfer from the specified account. The service provider must also determine
whether the user has exceeded allowed limits on withdrawals, whether the activity on this
account is unusual given past history, and other context-sensitive issues.</font> 

<ol>
  <li><a NAME="_Toc380493288"><font SIZE="4" FACE="Arial">Using SSL 3.0 in Open Financial
    Exchange</font></a> </li>
</ol>

<p><font SIZE="2">SSL version 3.0 provides a set of widely and commonly accepted methods
for securing Internet transactions. These common methods within SSL are called
CipherSuites. You can secure applications appropriately within SSL by specifying an
ordered sequence of preferred CipherSuites (highest preference listed first). Servers
select the strongest supported CipherSuite from the list provided by the client. </font></p>

<p><font SIZE="2"><i><b>NOTE:</b> Passing username and password pairs in a weakly
encrypted channel exposes this information to cryptographic attack. When implementing Open
Financial Exchange, use the strongest available ciphers.</i></font> </p>

<p><font SIZE="2">You should not use the following CipherSuites because they are
vulnerable to man-in-the-middle attacks during Open Financial Exchange message exchanges:</font>

<menu>
  <li><font SIZE="2">SSL_DH_anon_EXPORT_WITH_RC4_40_MD5 </font></li>
  <li><font SIZE="2">SSL_DH_anon_WITH_RC4_128_MD5 </font></li>
  <li><font SIZE="2">SSL_DH_anon_EXPORT_WITH_DES40_CBC_SHA </font></li>
  <li><font SIZE="2">SSL_DH_anon_WITH_DES_CBC_SHA </font></li>
  <li><font SIZE="2">SSL_DH_anon_WITH_3DES_EDE_CBC_SHA</font> </li>
</menu>

<p><a NAME="_Toc376002624"><font SIZE="2">Setting tags to enable channel-level security in
the FI profile advises the Open Financial Exchange application to use this security
method. Usually, the service provider of the Web server configures the allowed
CipherSuites within SSL. </font></a>

<ol>
  <li><a NAME="_Toc380493289"><font SIZE="5" FACE="Arial">Application-Level Security</font></a>
  </li>
</ol>

<p><font SIZE="2">While strong channel-level security is sufficient for the current suite
of Open Financial Exchange transactions, there are features that channel security does not
provide. These include (but are not limited to) data signing, non-repudiation, rational
certificate management and revocation, and trust proxy. Where the trust model for an
application requires such features to conduct the transaction safely, Open Financial
Exchange stipulates the use of an application-level protocol. A future implementation
guide will publish this protocol. </font></p>

<p><font SIZE="2">The standard method for providing application-level security is to rely
upon the RSA Public Key Cryptography Standard (PKCS) message format. The PKCS #7 standard
specifies a message format that is both cryptographically strong and flexible enough to
provide sufficient facilities for evolution. </font>

<ol>
  <li><a NAME="_Toc380493290"><font SIZE="4" FACE="Arial">Requirements for Application-Layer
    Security</font></a> </li>
  <li><font SIZE="2" FACE="Arial">Privacy, Authentication, and Message Integrity</font> </li>
</ol>

<p><font SIZE="2">RSA Public Key Cryptography Standard #7 (PKCS#7) defines a rich set of
message formats for securely exchanging information over public networks. These message
formats provide for encrypting data using a combination of cryptographic techniques to
leverage manageability of public key cryptography. It also utilizes the speed of block
ciphers into a hybrid, which exploits the best properties of each. </font></p>

<p><font SIZE="2">PKCS#7 message encryption provides privacy. A digitally signed message
(or applying HMAC) insures message integrity.</font> </p>

<p><font SIZE="2">Use one of the following to define PKCS#7 messages: Data, Digitally
Signed-Data, Enveloped-Data, or Digitally Signed and Enveloped-Data (also referred to as
Sealed-Data). Open Financial Exchange can use Digested-Data, which digests application
data before it embeds data within an Enveloped-Data object. However, it should not
transmit this data over public networks without encryption applied.</font> 

<ol>
  <li><font SIZE="2" FACE="Arial">Facilities for Authorization</font> </li>
</ol>

<p><font SIZE="2">As stated previously in the section 4.2, authentication and
authorization are the responsibility of the service provider. Open Financial Exchange
messages contain the information to enable authentication and authorization decisions.
With application-level security that uses a digitally signed format, the verification of
that signature provides an additional method of authenticating the user.</font> 

<ol>
  <li><font SIZE="4" FACE="Arial"><a NAME="_Toc380493291">Using Application-level Encryption
    in </a>Open Financial Exchange </font></li>
</ol>

<p><font SIZE="2">Open Financial Exchange applications requiring a sophisticated trust
model require more facilities than those provided by SSL. If an Open Financial Exchange
application requires only point-to-point security, SSL version 3.0 provides adequate
facilities for message security. However, if the application requires more directed,
specific forms of security, then use the appropriate PKCS#7 message formats for the
application. An example of this might be a stock trading application issuing orders whose
values demand that the security level be high, and where Open Financial Exchange treats
the message with special handling instructions. </font></p>

<p><font SIZE="2">Recommended cryptographic techniques for Open Financial Exchange
application security are: </font>

<ul>
  <li><font SIZE="2">RC4 for bulk encryption (using 40 bits for exportable applications, 128
    for North America)</font> </li>
  <li><font SIZE="2">RSA encryption of bulk encryption keys and digital signatures</font> </li>
  <li><font SIZE="2">SHA-1 as a secure hash algorithm </font></li>
</ul>

<p><font SIZE="2">In the absence of digital signatures, Open Financial Exchange
applications should utilize the HMAC keyed MAC algorithm, using SHA-1 as a secure hash
function. </font></p>

<p><font SIZE="2">When you set the tags for application-layer security-which determines
whether to use PKCS#7 message format-in the FI profile, the application software uses
these facilities. <br>
</font>

<ol>
  <li><a NAME="_Toc380493292"><font SIZE="6" FACE="Arial">International Support</font></a> </li>
  <li><a NAME="_Toc380493293"><font SIZE="5" FACE="Arial">Language and Encoding</font></a> </li>
</ol>

<p><font SIZE="2">Most of the content in Open Financial Exchange is language-neutral.
However, some error messages, balance descriptions, and similar tags contain text meant to
appear to the financial institution customers. There are also cases, such as e-mail
records, where customers need to send text in other languages. To support world-wide
languages, Open Financial Exchange must identify the basic text encoding, specific
character set, and the specific language.</font> </p>

<p><font SIZE="2">The outer Open Financial Exchange headers specify the encoding and
character set, as described Chapter 2. Current encoding values are ASCII and UNICODE. For
ASCII, character set values are code pages. Unicode ignores the character set <i>per se</i>
although it still requires the syntax. Clients identify the language in the signon
request. Open Financial Exchange specifies languages by three-letter codes as defined in
ISO-639. Servers report their supported languages in the profile (see Chapter 7). If a
server cannot support the requested language, they must return an error and not process
the rest of the transactions.</font> 

<ol>
  <li><a NAME="_Toc380493294"><font SIZE="5" FACE="Arial">Currency &lt;CURDEF&gt;
    &lt;CURRENCY&gt; &lt;ORIGCURRENCY&gt;</font></a> </li>
</ol>

<p><font SIZE="2">In each transaction involving amounts, responses include a default
currency identification, &lt;CURDEF&gt;. The values are based on the ISO 4217 three-letter
currency identifiers.</font><font SIZE="1"> </font></p>

<p><font SIZE="2">Within each transaction, specific parts of the response might need to
report a different currency. Where appropriate, aggregates will include an optional
&lt;CURRENCY&gt; aggregate. The scope of a &lt;CURRENCY&gt; aggregate is everything within
the same aggregate that the &lt;CURRENCY&gt; aggregate appears in, including nested
aggregates, unless overridden by a nested &lt;CURRENCY&gt; aggregate. For example,
specifying a &lt;CURRENCY&gt; aggregate in an investment statement detail means that the
unit price, transaction total, commission, and all other amounts are in terms of the given
currency, not the default currency. </font></p>

<p><font SIZE="2">Note that there is no way for two or more individual elements that
represent amounts-and are directly part of the same aggregate-to have different
currencies. For example, there is no way in a statement download to have a different
currency for the &lt;LEDGERBAL&gt; and the &lt;AVAILBAL&gt;, because they are both
directly members of &lt;STMTRS&gt;. In most cases, you can use the optional &lt;BAL&gt;
records to overcome this limitation, which do accept individual &lt;CURRENCY&gt;
aggregates.</font> </p>

<p><font SIZE="2">The default currency for a request is the currency of the source
account. For example, the currency for &lt;BANKACCTFROM&gt;.</font> </p>

<p><font SIZE="2">The &lt;CURRATE&gt; should be the one in effect throughout the scope of
the &lt;CURRENCY&gt; aggregate. It is not necessarily the current rate. Note that the
&lt;CURRATE&gt; needs to take into account the choice of the FI for formatting of amounts
(that is, where the decimal is) in both default and overriding currency, so that a client
can do math. This can mean that the rate is adjusted by orders of magnitude (up or down)
from what is commonly reported in newspapers.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="144"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="354"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;CURRENCY&gt;</font></b><font SIZE="1" FACE="Arial"> <i>or
    <br>
    </i><b>&lt;ORIGCURRENCY&gt;</b></font> </td>
    <td WIDTH="354"><font SIZE="2">Currency aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;CURSYM&gt;</font></b></td>
    <td WIDTH="354"><font SIZE="2">ISO 4217 3-letter currency identifier, <i>A-3</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;CURRATE&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Ratio of &lt;CURDEF&gt; currency to &lt;CURSYM&gt;
    currency, in decimal form</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;/CURRENCY&gt;</font></b><font SIZE="1" FACE="Arial">
    <i>or <br>
    </i><b>&lt;/ORIGCURRENCY&gt;</b></font> </td>
    <td WIDTH="354">&nbsp;</td>
  </tr>
</table>

<p>In some cases, Open Financial Exchange will define transaction responses so that
amounts have been converted to the home currency. However, Open Financial Exchange will
allow FIs to optionally report the original amount and the original (foreign) currency. In
these cases, transactions include a specific tag for the original amount, and then a
&lt;ORIGCURRENCY&gt; tag to report the details of the foreign currency. </p>

<p>Again, &lt;CURRENCY&gt; means that Open Financial Exchange <i>has not</i> converted
amounts. Whereas, &lt;ORIGCURRENCY&gt; means that Open Financial Exchange <i>has</i>
already converted amounts. 

<ol>
  <li><a NAME="_Toc380493295"><font SIZE="5" FACE="Arial">Country-Specific Tag Values</font></a>
  </li>
</ol>

<p><font SIZE="2">Some of the tags in Open Financial Exchange have values that are
country-specific. For example, &lt;USPRODUCTTYPE&gt; is only useful within the United
States. Open Financial Exchange will extend in each country as needed to provide tags that
accept values useful to that country. Clients in other countries that do not know about
these tags will simply skip them.</font> </p>

<p><font SIZE="2">In some cases, a tag value represents a fundamental way of identifying
something, yet there does not exist a world-wide standard for such identification.
Examples include bank accounts and securities. In these cases, it is important that Open
Financial Exchange defines a single, extensible approach for identification. For example,
CUSIPs are used within the U.S., but not in other countries. However, CUSIPs are
fundamental to relating investment securities, holdings, and transactions. Thus, a
security ID consists of a two-part aggregate: one to identify the naming scheme, and one
to provide a value. Open Financial Exchange will define valid naming schemes as necessary
for each country.<br>
<br>
<br>
</font>

<ol>
  <li><a NAME="_Toc380493296"><font SIZE="6" FACE="Arial">Data Synchronization</font></a> </li>
  <li><a NAME="_Toc380493297"><font SIZE="5" FACE="Arial">Overview</font></a> </li>
</ol>

<p><font SIZE="2">Currently, some systems provide only limited support for error recovery
and no support for backup files or multiple clients. The Open Financial Exchange data
synchronization approach described in this chapter handles all of these situations. </font></p>

<p><font SIZE="2">Open Financial Exchange defines a powerful form of data synchronization
between clients and servers. </font></p>

<p><font SIZE="2">Open Financial Exchange data synchronization addresses the following
problems:</font> 

<ul>
  <li><font SIZE="2">Error recovery</font> </li>
  <li><font SIZE="2">Use of multiple client applications</font> </li>
  <li><font SIZE="2">Restoring from a backup file</font> </li>
  <li><font SIZE="2">Multiple data files (for example, one copy at home, another at work).</font>
  </li>
</ul>

<p><font SIZE="2">This chapter first provides a brief background of error recovery
problems and then presents the basic strategy used in Open Financial Exchange to perform
data synchronization. Each Open Financial Exchange service includes specific details for
data synchronization requests and responses.</font> </p>

<p><font SIZE="2">Most of the information in this chapter concerns data synchronization,
since it is a relatively new concept. The final section in this chapter discusses
alternatives to full synchronization, and summarizes the options for each.</font> 

<ol>
  <li><a NAME="_Toc380493298"><font SIZE="5" FACE="Arial">Background</font></a> </li>
</ol>

<p><font SIZE="2">When a client begins a connection with a server for which the connection
does not successfully complete, there are two main problems:</font> 

<ul>
  <li><font SIZE="2">Unconfirmed requests</font> </li>
</ul>

<p><font SIZE="2">If a client does not receive a response to work it initiates, it has no
way of knowing whether the server processed the request. It also will not have any
server-supplied information about the request, such as a server ID number.</font> 

<ul>
  <li><font SIZE="2">Unsolicited data</font> </li>
</ul>

<p><font SIZE="2">Some banking protocols allow a server to send data to the client
whenever the client makes a connection. This specification assumes that the first client
that calls in after the unsolicited data is available for download receives the data. If
the connection fails, this information would be forever lost to the client. Examples of
unsolicited data include updates in the status of a bill payment and e-mail responses.</font>
</p>

<p><font SIZE="2">Unsolicited data presents problems beyond error recovery. Because the
first client that connects to a server is the only one to receive unsolicited data, this
situation precludes use of multiple clients without a data synchronization method. For
example, if a user has a computer at work and one at home, and wants to perform online
banking from both computers, a bank server could send unsolicited data to one but not the
other. </font></p>

<p><font SIZE="2">An even greater problem occurs when a user resorts to a backup copy of
the client data file. This backup file will be missing recent unsolicited data with no way
to retrieve it from the server once the server sends it.</font> 

<ol>
  <li><a NAME="_Toc380493299"><font SIZE="5" FACE="Arial">Data Synchronization Approach</font></a>
  </li>
</ol>

<p><font SIZE="2">A simple solution is to make sure that clients can always obtain
information from the server for a reasonable length of time. Clients can request recent
responses-whether due to client-initiated work or other status changes on the server-by
supplying the previous endpoint in the response history. Servers always supply a new
endpoint whenever they supply responses. </font></p>

<p><font SIZE="2">If a client connection fails-or a client receives a response, but
crashes before updating its database-the client will not save the new endpoint. On the
next synchronization request, the server sends the same information (plus any further
status changes). </font></p>

<p><font SIZE="2">If a user switches to a backup file, again the client will use the older
endpoint in the synchronization request. </font></p>

<p><font SIZE="2">If multiple clients are in use, each will send requests based on its own
endpoint, so that both clients will obtain complete information from the server. This is
one reason why Open Financial Exchange responses carry enough information from the request
to enable them to be processed on their own. The diagram below shows the relationship
between clients and servers.<br>
<br>
</font></p>

<p><font SIZE="2">Open Financial Exchange relieves the server from maintaining any special
error-recovery state information. However, Open Financial Exchange requires the server to
maintain a history of individual responses it would have sent and a way to identify a
position in the history. This ID could be a timestamp, or be based on its existing state
information. </font></p>

<p><font SIZE="2"><i><b>NOTE:</b> Open Financial Exchange does not require servers to
store these responses based on individual connections. Also, not all requests are subject
to synchronization. For example, Open Financial Exchange does not require servers to store
statement-download responses separately for data synchronization. </i></font>

<ol>
  <li><a NAME="_Toc380493300"><font SIZE="5" FACE="Arial">Data Synchronization Specifics</font></a>
  </li>
</ol>

<p><font SIZE="2">Open Financial Exchange does synchronization separately for each type of
response. In addition, a synchronization request might include further identifying
information, such as a specific account number. This specification defines the additional
information for each synchronization request.</font> </p>

<p><font SIZE="2">Each Open Financial Exchange service will identify the specific
responses that are subject to data synchronization. For example, a bank statement-download
is a read-only operation from the server. A client can request again if it fails;
consequently, there is no special data synchronization for this type of response.</font> </p>

<p><font SIZE="2">The basis for synchronization is a <i>token</i> as defined by the
&lt;TOKEN&gt; tag. The server is free to create a token in any way it wishes. The client
simply holds the token for possible use in a future synchronization request. </font></p>
<script>mySlowFunction(5);</script>
<p><font SIZE="2">The server can derive a token from one of the following: </font>

<ul>
  <li><font SIZE="2">Timestamp</font> </li>
  <li><font SIZE="2">Sequential number</font> </li>
  <li><font SIZE="2">Unique non-sequential number</font> </li>
  <li><font SIZE="2">Other convenient values for a server </font></li>
</ul>

<menu>
  <li><font SIZE="2"><i><b>NOTE:</b> Open Financial Exchange reserves a &lt;TOKEN&gt; value of
    zero for the first time each type of response does a synchronization task. </i></font></li>
</menu>

<p><font SIZE="2">Clients will send a &lt;TOKEN&gt; of zero on their first synchronization
request. Servers should send all available history, allowing a new client to know about
work done by other clients. If a user's account has never been used with Open Financial
Exchange, the server returns no history.</font> </p>

<p><font SIZE="2">The server can use different types of tokens for different types of
responses, if suitable for the server. </font></p>

<p><font SIZE="2">Tokens will be subject to a maximum size; see Chapter 3, &quot;Common
Aggregates, Elements, and Data Types.&quot; Tokens need to be unique only with respect to
a specific type of synchronization request and the additional information in that request.
For example, a bill payment synchronization request takes an account number; therefore, a
token needs to be unique only within payments for a specific account.</font> </p>

<p><font SIZE="2">Servers will not have infinite history available, so synchronization
responses include a &lt;LOSTSYNC&gt; element with a value of Y (yes) if the old token in
the synchronization request was older than available history. This tag allows clients to
alert users that some responses have been lost.</font> </p>

<p><font SIZE="2"><i><b>NOTE:</b> A token is unrelated to a &lt;TRNUID&gt;,
&lt;SRVRTID&gt;, or &lt;FITID&gt;. Each of these serves a specific purpose, and has its
own scope and lifetime. </i></font></p>

<p><font SIZE="2">A &lt;SRVRTID&gt; is not appropriate as a &lt;TOKEN&gt; for bill
payment. A single payment has a single &lt;SRVRTID&gt;, but it can undergo several state
changes over its life and thus have several entries in the token history.</font> </p>

<p><font SIZE="2">There are three different ways a client and a server can conduct their
requests and responses:</font> 

<ul>
  <li><font SIZE="2">Explicit synchronization - A client can request synchronization without
    sending any (other) Open Financial Exchange requests. Clients will send a specific
    synchronization request, including the current token for that request. The response will
    be a set of individual responses more recent than the given token, along with a new token.
    </font></li>
  <li><font SIZE="2">Synchronization with new requests - A client can request synchronization
    as part of the response to any new requests it has. It gives the old token. The response
    should include responses to the new requests plus any others that became available since
    the old token, along with a new token. An aggregate contains the requests so that the
    server can process the new requests and update the token as an atomic action.</font> </li>
  <li><font SIZE="2">New requests without synchronization - A client can make new requests
    without providing the old token. In this case, it expects just responses to the new
    requests. A subsequent request for synchronization will cause the client to send the same
    response again, because the client did not update its token.</font> </li>
</ul>

<p><font SIZE="2">Each request and response that requires data synchronization will define
a synchronization aggregate. The aggregate tells the server which particular kind of data
it should synchronize. By convention, these aggregates always have SYNC as part of their
tag names, for example, &lt;PMT<b>SYNC</b>RQ&gt;. You can use these aggregates on their
own to perform explicit synchronization, or as wrappers around one or more new
transactions. For example, you can use &lt;PMTSYNCRQ&gt; aggregates to request
synchronization in combination with new work. You can use the &lt;PMTTRNRQ&gt; by itself
if you do not require synchronization.</font> </p>

<p><font SIZE="2">Some clients can choose to perform an explicit synchronization before
sending any new requests (with or without synchronization). This practice allows clients
to be up-to-date and possibly interact with the user before sending any new requests.
Other clients can simply send new requests as part of the synchronization request. </font></p>

<p><font SIZE="2">If a client synchronizes in one file, then sends new work inside a
synchronization request in a second file, there is a small chance that additional
responses become available between the two connections. There is even a smaller chance
that these would be conflicting requests, such as modifications to the same object.
However, some clients and some requests might require absolute control, so that the user
can be certain that they are changing known data. To support this, synchronization
requests can optionally specify &lt;REJECTIFMISSING&gt;. The tag tells a server that it
should reject all enclosed requests if the supplied &lt;TOKEN&gt; is out of date <i>before
considering the new requests.</i> That is, if any new responses became available, whether
related to the incoming requests or not (but part of the scope of the synchronization
request), the server should immediately reject the requests. It should still return the
new responses. A client can then try again until it finds a stable window to submit the
work. See section 6.5 for more information about conflict detection and resolution.</font>
</p>

<p><font SIZE="2">The password change request and response present a special problem. See
section 2.5.2 for further information.</font> 

<ol>
  <li><a NAME="_Toc380493301"><font SIZE="5" FACE="Arial">Conflict Detection and Resolution</font></a>
  </li>
</ol>

<p><font SIZE="2">Conflicts arise whenever two or more users or servers modify the same
data. This can happen to any object that has a &lt;SRVRTID&gt; that supports change or
delete requests. For example, one spouse and the other might independently modify the same
recurring bill payment model. From a server perspective, there is usually no way to
distinguish between the same user making two intended changes and two separate users
making perhaps unintended changes. Therefore, Open Financial Exchange provides enough
tools to allow clients to carefully detect and resolve conflicts. Open Financial Exchange
requires only that a server process atomically all requests in a single &lt;OFX&gt; block.
</font></p>

<p><font SIZE="2">A careful client will always synchronize before sending any new
requests. If any responses come back that could affect a user's pending requests, the
client can ask the user whether it should still send those pending requests. Because there
is a small chance for additional server actions to occur between the initial
synchronization request and sending the user's pending requests, extremely careful clients
can use the &lt;REJECTIFMISSING&gt; option. Clients can iterate sending pending requests
inside a synchronization request with &lt;REJECTIFMISSING&gt; and testing the responses to
see if they conflict with pending requests. A client can continue to do this until a
window of time exists wherein the client is the only agent trying to modify the server. In
reality, this will almost always succeed on the first try.</font> 

<ol>
  <li><a NAME="_Toc380493302"><font SIZE="5" FACE="Arial">Synchronization vs. Refresh</font></a>
  </li>
</ol>

<p><font SIZE="2">There are some situations, and some types of clients, where it is
preferable for a client to ask a server to send everything it knows, rather than just
receive a set of changes. For example, a situation where a client that has not connected
often enough has lost synchronization. An example of &quot;type&quot; might be a
completely stateless client, such as a web browser. This choice is made during client
implementation. Open Financial Exchange does not require a client to refresh just because
it has lost synchronization.</font> </p>

<p><font SIZE="2">Clients will mainly want to refresh lists of long-lived objects on the
server; generally objects with a &lt;SRVRTID&gt;. For example, Open Financial Exchange
Payments has both individual payments and models of recurring payments. </font></p>

<p><font SIZE="2">A brand new client, or a client that lost synchronization, might want to
learn about in-progress payments by doing a synchronization refresh of the payment
requests. It would almost certainly want to do a synchronization refresh of the recurring
payment models, because these often live for months or years. </font></p>

<p><font SIZE="2">A client might not perform a synchronization refresh on e-mail
responses.</font> </p>

<p><font SIZE="2">A client can request a refresh by using the &lt;REFRESH&gt; tag with
value of Y instead of the &lt;TOKEN&gt; tag. Server descriptions detail the exact behavior
that servers should follow. However, the general rule is that servers should send
responses that emulate a client creating or adding each of the objects governed by the
particular synchronization request. </font></p>

<p><font SIZE="2">In these cases, you can set &lt;TRNUID&gt; to zero; the standard value
for server-generated responses. </font></p>

<p><font SIZE="2">There is no need to recreate a stream of responses that emulate the
entire history of the object, just an add response that reflects the current state. For
example, if you create a model and then modify it three times, even if this history would
have been available for a regular synchronization, servers should only send a single add
that reflects the current state. </font></p>

<p><font SIZE="2">A client that just wants the current token, without refresh or
synchronization, makes requests with &lt;TOKENONLY&gt; and a value of Y.</font> </p>

<p><font SIZE="2">In all cases, servers should send the current ending &lt;TOKEN&gt; for
the synchronization request in refresh responses. This allows a client to perform regular
synchronization requests in the future.</font> </p>

<p><font SIZE="2">The following table summarizes the options in a client synchronization
request:</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;TOKEN&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Previous value of &lt;TOKEN&gt; received for this type of
    synchronization request from server; 0 for first-time requests; <i>token</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;TOKENONLY&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Request for just the current &lt;TOKEN&gt; without the
    history, <i>Boolean</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;REFRESH&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Request for refresh of current state, <i>Boolean</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;REJECTIFMISSING&gt;</font> </td>
    <td WIDTH="366"><font SIZE="2">If Y, do not process requests if client &lt;TOKEN&gt; is
    out of date, <i>Boolean</i></font> </td>
  </tr>
</table>

<p><b>NOTE:</b> <i>Open Financial Exchange requires one each of</i> &lt;TOKEN&gt;,
&lt;TOKENONLY&gt;, <i>or</i> &lt;REFRESH&gt;. 

<ol>
  <li><a NAME="_Toc380493303"><font SIZE="5" FACE="Arial">Typical Server Architecture for
    Synchronization</font></a> </li>
</ol>

<p><font SIZE="2">This section describes how an FI can approach supporting synchronization
based on the assumption that modifications to an existing financial server will be kept to
a minimum. </font></p>

<p><font SIZE="2">The simplest approach is to create a history database separate from the
existing server. This history could consist of the actual Open Financial Exchange
transaction responses (&lt;TRNRS&gt; aggregates) that are available to a synchronization
request. The history database could index records by token, response type, and any other
identifying information for that type, such as account number. </font></p>

<p><font SIZE="2">The diagram below shows a high-level model of the Open Financial
Exchange architecture for a financial institution. Notice that the diagram shows the
presence of a history journal. <br>
<br>
</font></p>

<p><font SIZE="2">The server adds responses to the history journal for any action that
takes place on the existing server. This is true whether the Open Financial Exchange
requests initiate the action or, in the case of recurring payments, it happens
automatically on the server. Once added to the history journal, the server can forget
them.</font> </p>

<p><font SIZE="2">The areas of the Open Financial Exchange server that process
synchronization requests need only search this history database for matching responses
that are more recent than the incoming token. </font></p>

<p><font SIZE="2">For a refresh request, an Open Financial Exchange server would access
the actual bank server to obtain the current state rather than recent history. </font></p>

<p><font SIZE="2">Periodically the bank server would purge the history server of older
entries.</font> </p>

<p><font SIZE="2">Only requests that are subject to synchronization need to have entries
in the history database. Statement downloads do not involve synchronization; therefore,
the FI server should not add these responses to the history database. Since statement
downloads are usually the largest in space and the most frequent, eliminating these saves
much of the space a response history might otherwise require.</font> </p>

<p><font SIZE="2">More sophisticated implementations can save even more space. The history
database could save responses in a coded binary form that is more compact than the full
Open Financial Exchange response format. Some FIs might have much or all of the necessary
data already in their servers; consequently, they would not require new data. An FI could
regenerate synchronization responses rather than recall them from a database.</font> 

<ol>
  <li><a NAME="_Toc380493304"><font SIZE="5" FACE="Arial">Typical Client Processing of
    Synchronization Results</font></a> </li>
</ol>

<p><font SIZE="2">The diagram below shows a general flowchart of what an Open Financial
Exchange client would do with the results of a synchronization request. Most requests and
responses subject to data synchronization contain both &lt;TRNUID&gt; and &lt;SRVRTID&gt;.
<br>
<br>
<br>
</font>

<ol>
  <li><a NAME="_Toc380493305"><font SIZE="5" FACE="Arial">Simultaneous Connections</font></a> </li>
</ol>

<p><font SIZE="2">It is increasingly common that a server can get simultaneous or
overlapping requests from the same user over two different computers. Open Financial
Exchange requires a server to process each set of requests sent in a file as an atomic
action. Servers can deal with the problems that arise with simultaneous use in two ways:</font>

<ul>
  <li><font SIZE="2">Allow simultaneous connections, insure each is processed atomically, and
    use the data synchronization mechanism to bring the two clients up to date. This is the
    preferred method.</font> </li>
  <li><font SIZE="2">Lock out all but one user at a time, returning the error code for
    multiple users.</font> </li>
</ul>

<ol>
  <li><a NAME="_Toc380493306"><font SIZE="5" FACE="Arial">Synchronization Alternatives</font></a>
  </li>
</ol>

<p><font SIZE="2">Although it is <b>RECOMMENDED </b>that Open Financial Exchange servers
implement full synchronization as described in this chapter, an alternate approach,
&quot;lite synchronization,&quot; could be easier for some servers to support. This
approach focuses only on error recovery and does not provide any support for multiple
clients, multiple data files, or use of backup files. The approach is to preserve the
message sets while simplifying the implementation.</font> </p>

<p><font SIZE="2">In addition, some clients might prefer to use response-file based error
recovery with all servers, even if the client and some server both support full
synchronization. This section first describes lite synchronization, and then explains the
rules that clients and servers use to decide how to communicate.</font> 

<ol>
  <li><a NAME="_Toc380493307"><font SIZE="4" FACE="Arial">Lite Synchronization</font></a> </li>
</ol>

<p><font SIZE="2">Lite synchronization requires servers to accept all synchronization
messages, but does not require them to keep any history or tokens. Responses need only be
sent once and then the server can forget them. Responses to client requests, whether or
not they are made inside a synchronization request, are processed normally. Responses that
represent server-initiated work, such as payment responses that arise from recurring
payments, are sent only in response to synchronization requests. A server does not have to
hold responses in case a second client makes a synchronization request.</font> </p>

<p><font SIZE="2">Because full synchronization supports error recovery, an alternative is
needed for lite synchronization. Servers using lite synchronization keep a copy of the
entire response file they last sent. Clients requesting that servers prepare for error
recovery generate a globally unique ID for each file they send. In the OFX headers, there
are two tags associated with error recovery:</font> 

<ul>
  <li><font SIZE="2">OLDFILEUID - UID of the last request and response that was successfully
    received and processed by the client</font> </li>
  <li><font SIZE="2">NEWFILEUID - UID of the current file</font> </li>
</ul>

<p><font SIZE="2">The format of these is the same as used with &lt;TRNUID&gt; as
documented in Chapter 3.</font> </p>

<p><font SIZE="2">Servers use the following rules:</font> 

<ul>
  <li><font SIZE="2">If these tags are absent, the client is not requesting error recovery
    protection for this file. The server does not need to save a copy of the response.</font> </li>
  <li><font SIZE="2">If the NEWFILEUID matches a file saved on the server, then the client is
    in error recovery. The server must ignore the new requests in this file and instead send
    back the matching saved response file.</font> </li>
  <li><font SIZE="2">If the OLDFILEUID matches a file saved on the server, then OLDFILEUID is
    a file that the client has successfully processed and the server can delete it. The client
    is also requesting that the response for the current file be saved under the NEWFILEUID
    for possible error recovery.</font> </li>
</ul>

<p><font SIZE="2">A server will never need to save more than one file per client data
file, but because of possible multi-client or multi-datafile usage, it might need to save
several files for a given user. A server should save as long as possible, but not
indefinitely. A server cannot recognize an error recovery attempt if it comes after it has
purged the error recovery file. A server would process it as a new request. In this case,
a server should recognize duplicate transaction UIDs for client-initiated work, such as
payments, and then reject them individually. Server-generated responses would be lost to
the client.</font> </p>

<p><font SIZE="2">For a server accustomed to sending unsolicited responses, lite
synchronization should closely match the current response-file based implementation. The
only difference is that a server should hold the unsolicited responses until the client
makes the first appropriate synchronization request; rather than automatically adding them
to any response file. Once added, the server can mark them as delivered, relying on error
recovery to insure actual delivery.</font> 

<ol>
  <li><a NAME="_Toc380493308"><font SIZE="4" FACE="Arial">Relating Synchronization and Error
    Recovery</font></a> </li>
</ol>

<p><font SIZE="2">Client and server developers should first decide whether they will
support full synchronization or not. If they can, then they can support response-file
error recovery as well, or they can rely on synchronization to perform error recovery. If
they adopt only lite synchronization, Open Financial Exchange requires response-file error
recovery. A severs describes each of these choices in its server profile records. The
following combinations are valid:</font> 

<ul>
  <li><font SIZE="2">Full synchronization with response-file error recovery</font> </li>
  <li><font SIZE="2">Full synchronization without separate response-file error recovery</font>
  </li>
  <li><font SIZE="2">Lite synchronization with response-file error recovery</font> </li>
</ul>

<p><font SIZE="2">Clients request response-file error recovery by including the old and
new session UIDs in the header. If they are absent, servers need not save the response
file for error recovery. Clients request synchronization by using those synchronization
requests defined throughout this specification.</font> 

<ol>
  <li><a NAME="_Toc380493309"><font SIZE="5" FACE="Arial">Examples</font></a> </li>
</ol>

<p><font SIZE="2">Here is an example of full synchronization using bill payment as the
service. Open Financial Exchange Payments provides two different synchronization requests
and responses, each with their own token; one for payment requests and one for repeating
payment model requests. See Chapter 102 for full details.</font> </p>

<p><font SIZE="2">These simplified examples, show without the outer &lt;OFX&gt; layer,
&lt;SIGNON&gt;, and so forth.Client A requests synchronization:</font> </p>

<pre>
<font SIZE="1">&lt;PMTSYNCRQ&gt;
	&lt;TOKEN&gt;123
	&lt;BANKACCTFROM&gt;
		&lt;BANKID&gt;121000248
		&lt;ACCTID&gt;123456789
		&lt;ACCTTYPE&gt;CHECKING
	&lt;/BANKACCTFROM&gt;
&lt;/PMTSYNCRQ&gt;</font><font
SIZE="2">The server sends in response:
</font><font SIZE="1" FACE="Courier New">&lt;PMTSYNCRS&gt;
	&lt;TOKEN&gt;125
	&lt;LOSTSYNC&gt;N
	&lt;BANKACCTFROM&gt;
		&lt;BANKID&gt;121000248
		&lt;ACCTID&gt;123456789
		&lt;ACCTTYPE&gt;CHECKING
	&lt;/BANKACCTFROM&gt;
	&lt;PMTTRNRS&gt;
		&lt;STATUS&gt;
			... status details
		&lt;/STATUS&gt;
		&lt;TRNUID&gt;123
		&lt;PMTRS&gt;
			... details on a payment response
		&lt;/PMTRS&gt;
	&lt;/PMTTRNRS&gt;
	&lt;PMTTRNRS&gt;
		&lt;STATUS&gt;
			... status details
		&lt;/STATUS&gt;
		&lt;TRNUID&gt;546
		&lt;PMTRS&gt;
			... details on another payment response
		&lt;/PMTRS&gt;
	&lt;/PMTTRNRS&gt;
&lt;/PMTSYNCRS&gt;</font>
</pre>

<p><font SIZE="2">Client A was missing two payment responses, which the server provides.
At this point, client A is synchronized with the server. Client A now makes a new payment
request, and includes a synchronization update as part of the request. This update avoids
having to re-synchronize the expected response at a later time.</font> </p>

<pre>
<font SIZE="1">&lt;PMTSYNCRQ&gt;
	&lt;TOKEN&gt;125
	&lt;BANKACCTFROM&gt;
		&lt;BANKID&gt;121000248
		&lt;ACCTID&gt;123456789
		&lt;ACCTTYPE&gt;CHECKING
	&lt;/BANKACCTFROM&gt;
	&lt;PMTTRNRQ&gt;
		&lt;TRNUID&gt;12345
		&lt;PMTRQ&gt;
			... details of a new payment request
		&lt;/PMTRQ&gt;
	&lt;/PMTTRNRQ&gt;
&lt;/PMTSYNCRQ&gt;</font><font
SIZE="2">The response to this new
request:
</font><font SIZE="1" FACE="Courier New">&lt;PMTSYNCRS&gt;
	&lt;TOKEN&gt;126
	&lt;LOSTSYNC&gt;N
	&lt;BANKACCTFROM&gt;
		&lt;BANKID&gt;121000248
		&lt;ACCTID&gt;123456789
		&lt;ACCTTYPE&gt;CHECKING
	&lt;/BANKACCTFROM&gt;
	&lt;PMTTRNRS&gt;
		... details on a payment response to the new request
	&lt;/PMTTRNRS&gt;
&lt;/PMTSYNCRS&gt;</font>
</pre>

<p><font SIZE="2">The client now knows that the server has processed the payments request
it just made, and that nothing else has happened on the server since it last synchronized
with the server.</font> </p>

<p><font SIZE="2">Assume client B was synchronized with respect to payments for this
account up through token 125. If it called in now and synchronized-with or without making
additional requests-it would pick up the payment response associated with token 126. It
records the same information that was in client A, which would give both clients a
complete picture of payment status.<br>
</font>

<ol>
  <li><a NAME="_Toc380493310"><font SIZE="6" FACE="Arial">FI Profile</font></a> </li>
  <li><a NAME="_Toc380493311"><font SIZE="5" FACE="Arial">Overview</font></a> </li>
</ol>

<p><font SIZE="2">Open Financial Exchange clients use the profile to learn the
capabilities of an Open Financial Exchange server. This information includes general
properties such as account types supported, user password requirements, specific messages
supported, and how the client should batch requests and where to send the requests. A
client obtains a portion of the profile when a user first selects an FI. The client
obtains the remaining information prior to sending any actual requests to that FI. The
server uses a timestamp to indicate whether the server has updated the profile, and the
client checks periodically to see if it should obtain a new profile.</font> </p>

<p><font SIZE="2">In more detail, a profile response contains the following sections,
which a client can request independently:</font> 

<ul>
  <li><font SIZE="2">Message Sets - list of services and any general attributes of those
    services. Message sets are collections of messages that are related functionally. They are
    generally subsets of what users see as a service.</font> </li>
  <li><font SIZE="2">Signon realms - FIs can require different signons (user ID and/or
    password) for different message sets. Because there can only be one signon per &lt;OFX&gt;
    block, a client needs to know which signon the server requires and then provide the right
    signon for the right batch of messages.</font> </li>
</ul>

<p><font SIZE="2">The profile message is itself a message set. In files, Open Financial
Exchange uses the &lt;PROFMSGSV1&gt; aggregate to identify this profile message set.</font>
</p>

<p><font SIZE="2">The following sections describe the general use of profile information. </font>

<ol>
  <li><a NAME="_Toc380493312"><font SIZE="4" FACE="Arial">Message Sets</font></a> </li>
</ol>

<p><font SIZE="2">A message set is a collection of related messages. For example, Chapter
11, &quot;Banking,&quot; defines several message sets: statement download, credit card
statement download, intrabank transfers, and so forth. A server routes all of the messages
in a message set to a single URL and merges their versions together.</font> </p>

<p><font SIZE="2">Clients and servers generally use message sets as the granularity to
decide what functionality they will support. A &quot;banking&quot; server can choose to
support the statement download and intrabank transfer message sets, but not the wire
transfer message set. Attributes are available in many cases to further define how Open
Financial Exchange supports a message set.</font> </p>

<p><font SIZE="2">Each portion of the Open Financial Exchange specification that defines
messages also defines the message set to which that the messages belongs. This includes
what additional attributes are available for those messages, and whether Open Financial
Exchange requires the message set or it is optional.</font> 

<ol>
  <li><a NAME="_Toc380493313"><font SIZE="4" FACE="Arial">Version Control</font></a> </li>
</ol>

<p><font SIZE="2">Message sets are the basis of version control. Over time there will be
new versions of the message sets, and at any given time servers will likely want to
support more than one version of a message set. Clients should also be capable of
supporting as many versions as possible. Through the profile, clients discover which
versions are supported for each message set. Considering the client capabilities, it
exchanges messages at the highest common level for each message set. </font></p>

<p><font SIZE="2">For the Open Financial Exchange-SGML data format, there is a single DTD
for all message sets. Its version advances when any <i>syntactic</i> change is made to any
of the message sets. (It is possible to make a <i>semantic</i> change that would not even
require a change in syntax. A change in rules, for example, that would change the version
of the message set without changing the DTD.) A single DTD cannot have two different
definitions for the same aggregate. There are limitations to how a server that uses true
DTD-based parsing can handle multiple versions of a message at the same time.</font> 

<ol>
  <li><a NAME="_Toc380493314"><font SIZE="4" FACE="Arial">Batching and Routing</font></a> </li>
</ol>

<p><font SIZE="2">To allow FIs to set up different servers for different message sets,
different versions, or to directly route some messages to third party processors, message
sets define the URL to which a server sends messages in that message set. Each version of
a message set can have a different URL. In the common case where many or all message sets
are sent to a single URL, clients will consolidate messages across compatible message
sets. Clients can consolidate when:</font> 

<ul>
  <li><font SIZE="2">Message sets have the same URL</font> </li>
  <li><font SIZE="2">Message sets have a common security level</font> </li>
  <li><font SIZE="2">Message sets have the same signon realm</font> </li>
</ul>

<ol>
  <li><a NAME="_Toc380493315"><font SIZE="5" FACE="Arial">Profile Request</font></a> </li>
</ol>

<p><font SIZE="2">A profile request indicates which profile components a client desires.
It also indicates what the client's routing capability is. Profiles returned by the FI
must be compatible with the requested routing style, or it returns an error.</font> </p>

<p><font SIZE="2">Profile requests are not subject to synchronization. Use the
&lt;PROFTRNRQ&gt; transaction tag.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;<b>PROFRQ</b>&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Profile-request aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;CLIENTROUTING&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Identifies client routing capabilities, see table below</font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;DTPROFUP&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Date and time client last received a profile update</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/PROFRQ&gt;</font></b></td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">NONE</font></td>
    <td WIDTH="366"><font SIZE="2">Client cannot perform any routing. All URLs must be the
    same. All message sets share a single signon realm.</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">SERVICE</font></td>
    <td WIDTH="366"><font SIZE="2">Client can perform limited routing. See details below.</font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">MSGSET</font></td>
    <td WIDTH="366"><font SIZE="2">Client can route at the message-set level. Each message set
    may have a different URL and/or signon realm.</font> </td>
  </tr>
</table>

<p>The intent of the SERVICE option for client routing is to support clients that can
route bill payment messages to a separate URL from the rest of the messages. Because the
exact mapping of message sets to the general concept of bill payment can vary by client
and by locale, this specification does not provide precise rules for the SERVICE option.
Each client will define its requirements. <br>

<ol>
  <li><a NAME="_Toc380493316"><font SIZE="5" FACE="Arial">Profile Response</font></a> </li>
</ol>

<p><font SIZE="2">The response includes message set descriptions, signon information, and
general contact information.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="144"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="354"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;PROFRS&gt;</font></b></td>
    <td WIDTH="354"><font SIZE="2">Profile-response aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;MSGSETLIST&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Beginning list of message set information</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;<b><i>XXXMSGSET</i>&gt;</b></font></b> </td>
    <td WIDTH="354"><font SIZE="2">One or more message set aggregates</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;/<b><i>XXXMSGSET</i>&gt;</b></font></b> </td>
    <td WIDTH="354">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;/MSGSETLIST&gt;</font></b> </td>
    <td WIDTH="354">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;SIGNONINFOLIST&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Beginning of signon information</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;SIGNONINFO&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">One or more signon information aggregates</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;/SIGNONINFO&gt;</font></b> </td>
    <td WIDTH="354">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;/SIGNONINFOLIST&gt;</font></b> </td>
    <td WIDTH="354">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;DTPROFUP&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Time this was updated on server, <i>datetime</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;FINAME&gt;</font></b></td>
    <td WIDTH="354"><font SIZE="2">Name of institution, <i>A-32</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;ADDR1&gt;</font></b></td>
    <td WIDTH="354"><font SIZE="2">FI address, line 1</font></td>
  </tr>
  <tr>
    <td WIDTH="144"><font SIZE="1" FACE="Arial">&lt;ADDR2&gt;</font> </td>
    <td WIDTH="354"><font SIZE="2">FI address, line 2</font></td>
  </tr>
  <tr>
    <td WIDTH="144"><font SIZE="1" FACE="Arial">&lt;ADDR3&gt;</font> </td>
    <td WIDTH="354"><font SIZE="2">FI address, line 3</font></td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;CITY&gt;</font></b></td>
    <td WIDTH="354"><font SIZE="2">FI address city</font></td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;STATE&gt;</font></b></td>
    <td WIDTH="354"><font SIZE="2">FI address state</font></td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;POSTALCODE&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">FI address postal code</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;COUNTRY&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">FI address country</font></td>
  </tr>
  <tr>
    <td WIDTH="144"><font SIZE="1" FACE="Arial">&lt;CSPHONE&gt;</font> </td>
    <td WIDTH="354"><font SIZE="2">Customer service telephone number, <i>A-32</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><font SIZE="1" FACE="Arial">&lt;TSPHONE&gt;</font> </td>
    <td WIDTH="354"><font SIZE="2">Technical support telephone number, <i>A-32</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><font SIZE="1" FACE="Arial">&lt;FAXPHONE&gt;</font> </td>
    <td WIDTH="354"><font SIZE="2">Fax number, <i>A-32</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><font SIZE="1" FACE="Arial">&lt;URL&gt;</font> </td>
    <td WIDTH="354"><font SIZE="2">URL for general information about FI (not for sending data)
    <i>URL</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><font SIZE="1" FACE="Arial">&lt;EMAIL&gt;</font> </td>
    <td WIDTH="354"><font SIZE="2">E-mail address for FI, <i>A-32</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;SYNCMODE&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">FULL for full synchronization capability <br>
    LITE for lite synchronization capability</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;RESPFILEER&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Y if server supports response-file based error recovery, <i>Boolean</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;/PROFRS&gt;</font></b></td>
    <td WIDTH="354">&nbsp;</td>
  </tr>
</table>

<p>See the Chapter 6 for more information on &lt;SYNCMODE&gt; and &lt;RESPFILEER&gt;. 

<ol>
  <li><font SIZE="4" FACE="Arial"><a NAME="_Toc380493317">Message Set</a> </font></li>
</ol>

<p><font SIZE="2">An aggregate describes each message set supported by an FI. Message sets
in turn contain an aggregate for each version of the message set that is supported. For a
message set named <i>XXX</i>, the convention is to name the outer aggregate &lt;<i>XXX</i>MSGSET&gt;
and the tag for each version &lt;<i>XXX</i>MSGSETVn&gt;. The reason for message
set-specific aggregates is that the set of attributes depends on the message set. These
can change from version to version, so there are version-specific aggregates as well.</font>
</p>

<p><font SIZE="2">The general form of the response is:</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="144"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="354"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;<b><i>XXXMSGSET</i>&gt;</b></font></b> </td>
    <td WIDTH="354"><font SIZE="2">Service aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;<b><i>XXXMSGSETVn</i>&gt;</b></font></b> </td>
    <td WIDTH="354"><font SIZE="2">Version-of-message-set aggregate, 1 or more</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;/<b><i>XXXMSGSETVn</i>&gt;</b></font></b> </td>
    <td WIDTH="354">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;/<b><i>XXXMSGSET</i>&gt;</b></font></b> </td>
    <td WIDTH="354">&nbsp;</td>
  </tr>
</table>

<p>The &lt;<b><i>XXX</i>MSGSETVn</b>&gt; aggregate has the following form:<br>
</p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="144"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="354"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;<b><i>XXX</i>MSGSETVn&gt;</b></font></b> </td>
    <td WIDTH="354"><font SIZE="2">Message-set-version aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;MSGSETCORE&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Common message set information</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;/MSGSETCORE&gt;</font></b> </td>
    <td WIDTH="354">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="144"><font SIZE="1">message-set specific</font></td>
    <td WIDTH="354"><font SIZE="2">Zero or more attributes specific to this version of this
    message set, as defined by each message set</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;/<b><i>XXX</i>MSGSETVn&gt;</b></font></b> </td>
    <td WIDTH="354">&nbsp;</td>
  </tr>
</table>

<p>The common message set information &lt;MSGSETCORE&gt; is as follows: <br>
</p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="144"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="354"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;MSGSETCORE&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Common-message-set-information aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;VER&gt;</font></b></td>
    <td WIDTH="354"><font SIZE="2">Version number, <i>N-5 </i>(version 1.0 formatted as 100)</font>
    </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;URL&gt;</font></b></td>
    <td WIDTH="354"><font SIZE="2">URL where messages in this set are to be sent</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;OFXSEC&gt;</font></b></td>
    <td WIDTH="354"><font SIZE="2">Security level required for this message set; see Chapter 4</font>
    </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;TRANSPSEC&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Y if transport security must be used, N if not used; <i>Boolean</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;SIGNONREALM&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Signon realm to use with this message set</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;LANGUAGE&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">One or more languages supported</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;/MSGSETCORE&gt;</font></b> </td>
    <td WIDTH="354">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493318"><font SIZE="4" FACE="Arial">Signon Realms</font></a> </li>
</ol>

<p><font SIZE="2">A signon realm identifies a set of messages that can be accessed using
the same password. Realms are used to disassociate signons from specific services,
allowing FIs to require different signons for different message sets. In practice, FIs
will want to use the absolute minimum number of realms possible to reduce the user's
workload.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="144"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="354"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;SIGNONINFO&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Signon-information aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;SIGNONREALM&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Identifies this realm</font></td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;MIN&gt;</font></b></td>
    <td WIDTH="354"><font SIZE="2">Minimum number of password characters</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;MAX&gt;</font></b></td>
    <td WIDTH="354"><font SIZE="2">Max number of password characters</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;ALPHA&gt;</font></b></td>
    <td WIDTH="354"><font SIZE="2">Y if alphabetic characters are allowed, <i>Boolean</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;NUMERIC&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Y if numeric characters are allowed, <i>Boolean</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;CASESEN&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Y if password is case-sensitive, <i>Boolean</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;SPECIAL&gt;</font></b> </td>
    <td WIDTH="354"><font SIZE="2">Y if special characters are allowed, <i>Boolean</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;SPACES&gt;</font></b></td>
    <td WIDTH="354"><font SIZE="2">Y if spaces are allowed, <i>Boolean</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><b><font SIZE="1">&lt;/SIGNONINFO&gt;</font></b> </td>
    <td WIDTH="354">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493319"><font SIZE="4" FACE="Arial">Status Codes</font></a> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="144"><i><font SIZE="1">Value</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="354"><i><font SIZE="2">Meaning</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="144"><font SIZE="1">0</font></td>
    <td WIDTH="354"><font SIZE="2">Success (INFO)</font> </td>
  </tr>
  <tr>
    <td WIDTH="144"><font SIZE="1">2000</font></td>
    <td WIDTH="354"><font SIZE="2">General error (ERROR)</font> </td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493320"><font SIZE="5" FACE="Arial">Profile Message Set Profile
    Information</font></a> </li>
</ol>

<p><img src="" width="214" height="214" alt=" (22120 bytes)"><br>
stadyn_image8</p>

<p><font SIZE="2">&nbsp;</font></p>

<p><font SIZE="2">The profile message set functions the same way as all other message
sets; therefore, it contains a profile description for that message set. Because
&lt;PROFMSGSET&gt; is always part of a message set response, it is described here. Servers
that support profile information must include the &lt;PROFMSGSET&gt; as part of the
profile response &lt;MSGSETLIST&gt;. There are no attributes, but the aggregate must be
present to indicate support for the message set.<br>
</font></p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="162"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="336"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;PROFMSGSET&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Message-set-profile-information aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;PROFMSGSETV1&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Opening tag for V1 of the message set profile information</font>
    </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;MSGSETCORE&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Common message set information</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/MSGSETCORE&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/PROFMSGSETV1&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/PROFMSGSET&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493321"><font SIZE="6" FACE="Arial">Activation &amp; Account Information</font></a>
  </li>
  <li><a NAME="_Toc380493322"><font SIZE="5" FACE="Arial">Overview</font></a> </li>
</ol>

<p><font SIZE="2">The Signup message set defines three messages to help users get setup
with their FI:</font> 

<ul>
  <li><font SIZE="2">Enrollment - informs FI that a user wants to use Open Financial Exchange
    and requests that a password be returned</font> </li>
  <li><font SIZE="2">Accounts - asks the FI to return a list of accounts, and the services
    supported for each account</font> </li>
  <li><font SIZE="2">Activation - allows a client to tell the FI which services a user wants
    on each account</font> </li>
</ul>

<p><font SIZE="2">There is also a message to request name and address changes.</font> </p>

<p><font SIZE="2">Clients use the account information request on a regular basis to look
for changes in a user's account information. A timestamp is part of the request so that a
server has only to report new changes. Account activation requests are subject to data
synchronization, and will allow multiple clients to learn how the other clients have been
enabled.</font> </p>

<p><font SIZE="2">In Open Financial Exchange files, the &lt;SIGNUPMSGSV1&gt; aggregate
identifies the Signup message.</font> 

<ol>
  <li><a NAME="_Toc380493323"><font SIZE="5" FACE="Arial">Approaches to User Sign-Up with Open
    Financial Exchange</font></a> </li>
</ol>

<p><font SIZE="2">The message sets in this chapter are designed to allow both FIs and
clients to support a variety of sign-up procedures. There are four basic steps a user
needs to go through to complete the sign-up:</font> 

<ol>
  <li><font SIZE="2"><b>Select the FI</b>. Open Financial Exchange does not define this step
    or provide message sets to support it. Client developers and FIs can let a user browse or
    search this information on a web site, or might define additional message sets to do this
    within the client. At the conclusion of this step, the client will have some minimal
    profile information about the FI, including the set of services supported and the URL to
    use for the next step.</font> </li>
  <li><font SIZE="2"><b>Enrollment and password acquisition.</b> In this step, the user
    identifies and authenticates itself to the FI <i>without a password</i>. In return, the
    user obtains a password (possibly temporary) to use with Open Financial Exchange. FIs can
    perform this entire step over the telephone, through a combination of telephone requests
    and a mailed response, or at the FI web site. FIs can also use the Open Financial Exchange
    enrollment message to do this by means of the client. The response can contain a temporary
    password or users can wait for a mailed welcome letter containing the password.</font> </li>
  <li><font SIZE="2"><b>Account Information.</b> In this step, the user obtains a list of
    accounts available for use with Open Financial Exchange, and which specific services are
    available for each account. Even if users have enrolled over the telephone, clients will
    still use this message set to help users properly set up the accounts within the client.
    Clients periodically check back with the FI for updates.</font> </li>
  <li><font SIZE="2"><b>Service Activation.</b> The last step is to activate specific services
    on specific accounts. The activation messages support this step. Synchronization is
    applied to these messages to insure that other clients are aware of activated services.</font>
  </li>
</ol>

<p><font SIZE="2">The combination of media-interface through which an FI accomplishes
these steps can vary. FIs might wish to do steps two through four over the telephone.
Clients will still use Open Financial Exchange messages in steps 3 and 4 to automatically
set up the client based on the choices made by the user over the phone. Other FIs might
wish to have the entire user experience occur within the client. Either way, the Open
Financial Exchange sign-up messages support the process.</font> 

<ol>
  <li><a NAME="_Toc380493324"><font SIZE="5" FACE="Arial">Users and Accounts</font></a> </li>
</ol>

<p><font SIZE="2">To support the widest possible set of FIs, Open Financial Exchange
assumes that individual users and accounts are in a many-to-many relationship. Consider a
household with three accounts:</font> 

<ul>
  <li><font SIZE="2">Checking 1 - held individually by one spouse</font> </li>
  <li><font SIZE="2">Checking 2 - held jointly by both</font> </li>
  <li><font SIZE="2">Checking 3 - held individually by the other spouse</font> </li>
</ul>

<p><font SIZE="2">Checking 2 should be available to either spouse, and the spouse holding
Checking 1 should be able to see both Checking 1 and 2.</font> </p>

<p><font SIZE="2">Open Financial Exchange expects FIs to give each user their own user ID
and password. Each user will go through the enrollment step separately. A given account
need only be activated once for a service; not once for each user. Clients will use the
account information and activation messages to combine information about jointly-held
accounts.</font> </p>

<p><font SIZE="2">If an FI prefers to have a single user ID and password per household or
per master account, they will have to make this clear to users through the enrollment
process. It is up to the FI to assign a single user ID and password that can access all
three of the checking accounts described above.</font> 

<ol>
  <li><a NAME="_Toc380493325"><font SIZE="5" FACE="Arial">Enrollment and Password Acquisition
    &lt;ENROLLRQ&gt; &lt;ENROLLRS&gt;</font></a> </li>
</ol>

<p><font SIZE="2">The main purpose of the enrollment message is to communicate a user's
intent to access the FI by way of Open Financial Exchange and to acquire a password for
future use with Open Financial Exchange. Some FIs might return a user ID and an initial
password in the enrollment response, while others will send them by way of regular mail. </font></p>

<p><font SIZE="2"><i><b>NOTE:</b> Because the server does not know the user ID and
password when the client sends the enrollment request, the &lt;SONRQ&gt; will not contain
a valid user ID or password. The enrollment message accepts standard user identification
information. </i></font></p>

<p><font SIZE="2">Enrollment requests are not subject to synchronization. If the client
does not receive a response, it will simply re-request the enrollment. If a user
successfully enrolls from another client before the first client obtains a response, the
server should respond to subsequent requests from the first client with status code: </font></p>

<pre>
<font SIZE="1">13501 - user already enrolled.</font>
</pre>

<ol>
  <li><a NAME="_Toc380493326"><font SIZE="4" FACE="Arial">User IDs</font></a> </li>
</ol>

<p><font SIZE="2">The Open Financial Exchange &lt;SONRQ&gt; requires a user ID to uniquely
identify a user to an FI. Many FIs in the United States use social security numbers (SSNs)
as the ID. Others create IDs that are unrelated to the users' SSNs. FIs can have an
existing user IDs that they use for other online activities that they wish to use for Open
Financial Exchange as well. They might also create new IDs specifically for Open Financial
Exchange. Finally, some FIs might assign IDs while others might allow users to create
them. </font></p>

<p><font SIZE="2">Because users do not usually know either their Open Financial Exchange
sign-on user ID or their password at time of enrollment, the enrollment response is
designed to return both. The enrollment request allows users to optionally provide a user
ID, which an FI can interpret as their existing online ID or a suggestion for what their
new user ID should be. It is recommended that the enrollment process explains ID syntax to
users.</font> 

<ol>
  <li><a NAME="_Toc380493327"><font SIZE="4" FACE="Arial">Enrollment Request</font></a> </li>
</ol>

<p><font SIZE="2">The enrollment request captures enough information to identify and
authenticate a user as being legitimate and that it has a relationship with the FI. </font></p>

<p><font SIZE="2">FIs might require that an account number be entered as part of the
identification process. However, this is discouraged since the account information request
is designed to automatically obtain all account information, avoiding the effort and
potential mistakes of a user-supplied account number. </font></p>

<p><font SIZE="2">It is <b>RECOMMENDED</b> that FIs provide detailed specifications for
IDs and passwords along with information about the services available when a user is
choosing an FI.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="180"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="318"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;ENROLLRQ&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Enrollment-request aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;FIRSTNAME&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">First name of user</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;MIDDLENAME&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Middle name of user</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;LASTNAME&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Last name of user</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;ADDR1&gt;</font></b></td>
    <td WIDTH="318"><font SIZE="2">Address line 1</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;ADDR2&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Address line 2</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;ADDR3&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Address line 3</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;CITY&gt;</font></b></td>
    <td WIDTH="318"><font SIZE="2">City</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;STATE&gt;</font></b></td>
    <td WIDTH="318"><font SIZE="2">State or province</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;POSTALCODE&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Postal code</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;COUNTRY&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">3-letter country code from ISO/DIS-3166</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;DAYPHONE&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Daytime telephone number</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;EVEPHONE&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Evening telephone number</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;EMAIL&gt;</font></b></td>
    <td WIDTH="318"><font SIZE="2">Electronic e-mail address</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;USERID&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Actual user ID if already known, or preferred user ID if
    user can pick</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;TAXID&gt;</font></b></td>
    <td WIDTH="318"><font SIZE="2">ID used for tax purposes (such as SSN), may be same as user
    ID</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;SECURITYNAME&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Mother's maiden name or equivalent</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;DATEBIRTH&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Date of birth</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;<i>ACCTFROM&gt;</i></font> </td>
    <td WIDTH="318"><font SIZE="2">An account description aggregate for one existing account
    at the FI, for identification purposes only. Can be &lt;BANKACCTFROM&gt;,
    &lt;INVACCTFROM&gt;, etc.</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;/<i>ACCTFROM</i>&gt;</font> </td>
    <td WIDTH="318">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;/ENROLLRQ&gt;</font></b> </td>
    <td WIDTH="318">&nbsp;</td>
  </tr>
</table>

<p>This enrollment request is intended for use only by individuals. Business enrollment
will be defined in a later release. 

<ol>
  <li><a NAME="_Toc380493328"><font SIZE="4" FACE="Arial">Enrollment Response</font></a> </li>
</ol>

<p><font SIZE="2">The main purpose of the enrollment response is to acknowledge the
request. In those cases where FIs permit delivery of an ID and a temporary password, the
response also provides for this. Otherwise the server will send the real response to the
user by way of regular mail, electronic mail, or over the telephone. If enrollment is
successful, but the server does not return the ID and password in the response, a server
is REQUIRED to use status code 10 and provide some information to the user by means of the
&lt;MESSAGE&gt; element in the &lt;STATUS&gt; aggregate about what to expect next.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="180"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="318"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;ENROLLRS&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Enrollment-response aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;TEMPPASS&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Temporary password</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1">&lt;USERID&gt;</font></td>
    <td WIDTH="318"><font SIZE="2">User ID</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;DTEXPIRE&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Time the temporary password expires (if &lt;TEMPPASS&gt;
    included)</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;/ENROLLRS&gt;</font></b> </td>
    <td WIDTH="318">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493329"><font SIZE="4" FACE="Arial">Enrollment Status Codes</font></a> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="72"><i><font SIZE="1">Code</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="300"><i><font SIZE="2">Meaning</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">0</font></td>
    <td WIDTH="300"><font SIZE="2">Success (INFO)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2000</font></td>
    <td WIDTH="300"><font SIZE="2">General error (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">13000</font></td>
    <td WIDTH="300"><font SIZE="2">User ID &amp; password will be sent out-of-band (INFO)</font>
    </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">13500</font></td>
    <td WIDTH="300"><font SIZE="2">Unable to enroll (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">13501</font></td>
    <td WIDTH="300"><font SIZE="2">User already enrolled (ERROR)</font> </td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493330"><font SIZE="4" FACE="Arial">Examples</font></a><font SIZE="2">An
    enrollment request:</font> </li>
</ol>

<pre>
<font SIZE="1">&lt;ENROLLTRNRQ&gt;
	&lt;TRNUID&gt;12345  
	&lt;ENROLLRQ&gt;
		&lt;FIRSTNAME&gt;Joe
		&lt;MIDDLENAME&gt;Lee
		&lt;LASTNAME&gt;Smith
		&lt;ADDR1&gt;21 Main St.
		&lt;CITY&gt;Anytown
		&lt;STATE&gt;TX
		&lt;POSTALCODE&gt;87321
		&lt;COUNTRY&gt;USA
		&lt;DAYPHONE&gt;123-456-7890
		&lt;EVEPHONE&gt;987-654-3210
		&lt;EMAIL&gt;jsmith@isp.com
		&lt;USERID&gt;jls
		&lt;TAXID&gt;123-456-1234
		&lt;SECURITYNAME&gt;jbmam
		&lt;DATEBIRTH&gt;19530202
	&lt;/ENROLLRQ&gt;
&lt;/ENROLLTRNRQ&gt;</font><font
SIZE="2">And the reply might be:
</font><font SIZE="1" FACE="Courier New">&lt;ENROLLTRNRS&gt;
	&lt;TRNUID&gt;12345
	&lt;STATUS&gt;
		&lt;CODE&gt;0
		&lt;SEVERITY&gt;INFO
	&lt;/STATUS&gt;
	&lt;ENROLLRS&gt;
		&lt;TEMPPASS&gt;changeme
		&lt;USERID&gt;jls
		&lt;DTEXPIRE&gt;19970105
	&lt;/ENROLLRS&gt;
&lt;/ENROLLTRNRS&gt;</font>
</pre>

<ol>
  <li><a NAME="_Toc380493331"><font SIZE="5" FACE="Arial">Account Information</font></a> </li>
</ol>

<p><font SIZE="2">Account information requests ask a server to identify and describe all
of the accounts accessible by the signed-on user. The definition of <i>all</i> is up to
the FI. At a minimum, it is <b>RECOMMENDED</b> that a server include information about all
accounts that it can activate for one or more Open Financial Exchange services. To give
the user a complete picture of his relationship with an FI, FIs can give information on
other accounts, even if those accounts are available only for limited Open Financial
Exchange services.</font> </p>

<p><font SIZE="2">Some service providers will not have any prior knowledge of any user
account information. The profile allows these servers to report this, and clients will
then know to ask users for account information rather than reading it from the server.</font>
</p>

<p><font SIZE="2">Clients can perform several tasks for users with this account
information. First, the information helps a client set up a user for online services by
giving it a precise list of its account information and available services for each.
Clients can set up their own internal state as well as prepare service activation requests
with no further typing by users. This can eliminate data entry mistakes in account
numbers, routing transit numbers, and so forth.</font> </p>

<p><font SIZE="2">Second, FIs can provide limited information on accounts that would not
ordinarily be suitable to Open Financial Exchange services. For example, a balance-only
statement download would be useful for certificates of deposits even though a customer or
an FI might not want or allow CDs to be used for full statement download.</font> </p>

<p><font SIZE="2">For each account, there is one &lt;ACCTINFO&gt; aggregate returned. The
aggregate includes one service-specific account information aggregate for each available
service on that account. That, in turn, provides the service-specific account
identification. Common to each service-specific account information aggregate is the
&lt;SVCSTATUS&gt; tag, which indicates the status of this service on this account.</font> </p>

<p><font SIZE="2">A server should return joint accounts (accounts for which more than one
user ID can be used to access the account) for either user. Clients that wish to have a
unified view will aggregate the results and remove duplicates before making specific
requests involving joint accounts.</font> </p>

<p><font SIZE="2">Requests and responses include a &lt;DTACCTUP&gt; element. Responses
contain the last time a server updated the information. Clients can <b>OPTIONALLY </b>send
this in a subsequent request, and servers are <b>REQUIRED </b>to compare this to the
current modification time and only send information if it is more recent. The server sends
the entire account information response if the client's time is older; there is no attempt
to incrementally update specific account information.</font> 

<ol>
  <li><a NAME="_Toc380493332"><font SIZE="4" FACE="Arial">Request &lt;ACCTINFORQ&gt;</font></a>
  </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="180"><i><font SIZE="2">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="318"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;ACCTINFORQ&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Account-information-request aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;DTACCTUP&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Last &lt;DTACCTUP&gt; received in a response</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;INCIMAGES&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Y if server should include logo in response, N if client
    will separately fetch them based on given URL; <i>Boolean</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;/ACCTINFORQ&gt;</font></b> </td>
    <td WIDTH="318">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493333"><font SIZE="4" FACE="Arial">Response &lt;ACCTINFORS&gt;</font></a>
  </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="180"><i><font SIZE="2">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="318"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;ACCTINFORS&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Account-information-response aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;DTACCTUP&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Date and time of last update to this information on the
    server</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;ACCTINFO&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Zero or more account information aggregates</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;/ACCTINFO&gt;</font> </td>
    <td WIDTH="318">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;/ACCTINFORS&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">End of account information response</font> </td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493334"><font SIZE="4" FACE="Arial">Account Information Aggregate
    &lt;ACCTINFO&gt;</font></a> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="210"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="288"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="210"><b><font SIZE="1">&lt;ACCTINFO&gt;</font></b> </td>
    <td WIDTH="288"><font SIZE="2">Account-information-record aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="210"><font SIZE="1">&lt;DESC&gt;</font></td>
    <td WIDTH="288"><font SIZE="2">Description of the account, <i>A-80</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="210"><font SIZE="1">&lt;PHONE&gt;</font></td>
    <td WIDTH="288"><font SIZE="2">Telephone number for the account, <i>A-20</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="210"><font SIZE="1">&lt;LOGO&gt;</font></td>
    <td WIDTH="288"><font SIZE="2">URL to request the logo for the account (actual logos
    should be included via multi-part MIME in the response file if requested), <i>URL</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="210"><b><font SIZE="1">&lt;<i><b>XXXACCTINFO&gt;</b></i></font></b> </td>
    <td WIDTH="288"><font SIZE="2">Service-specific account information, defined in each
    service chapter, one or more allowed</font> </td>
  </tr>
  <tr>
    <td WIDTH="210"><b><font SIZE="1">&lt;<b><i>XXXACCTFROM</i>&gt;</b></font></b> </td>
    <td WIDTH="288"><font SIZE="2">Service-specific account identification</font> </td>
  </tr>
  <tr>
    <td WIDTH="210"><b><font SIZE="1">&lt;/<b><i>XXXACCTFROM</i>&gt;</b></font></b> </td>
    <td WIDTH="288">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="210"><b><font SIZE="1">&lt;SVCSTATUS&gt;</font></b> </td>
    <td WIDTH="288"><font SIZE="2">AVAIL = Available, but not yet requested</font> <p><font
    SIZE="2">PEND = Requested, but not yet available</font> </p>
    <p><font SIZE="2">ACTIVE = In use</font> </td>
  </tr>
  <tr>
    <td WIDTH="210"><b><font SIZE="1">&lt;/<b><i>XXXACCTINFO</i>&gt;</b></font></b> </td>
    <td WIDTH="288">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="210"><b><font SIZE="1">&lt;/ACCTINFO&gt;</font></b> </td>
    <td WIDTH="288">&nbsp;</td>
  </tr>
</table>

<p><i><b>NOTE:</b> A server uses the &lt;DESC&gt; field to convey the FI's preferred name
for the account, such as &quot;PowerChecking.&quot; It should not include the account
number. </i>

<ol>
  <li><a NAME="_Toc380493335"><font SIZE="4" FACE="Arial">Status Codes</font></a> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="72"><i><font SIZE="1">Code</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="300"><i><font SIZE="2">Meaning</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">0</font></td>
    <td WIDTH="300"><font SIZE="2">Success (INFO)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2000</font></td>
    <td WIDTH="300"><font SIZE="2">General error (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">13001</font></td>
    <td WIDTH="300"><font SIZE="2">No change since supplied &lt;DTACCTUP&gt; (INFO)</font> </td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493336"><font SIZE="4" FACE="Arial">Examples</font></a><font SIZE="2">An
    account information request:</font> </li>
</ol>

<pre>
<font SIZE="1">&lt;ACCTINFOTRNRQ&gt;
	&lt;TRNUID&gt;12345
	&lt;ACCTINFORQ&gt;
		&lt;DTACCTUP&gt;19960101
		&lt;INCIMAGES&gt;N
	&lt;/ACCTINFORQ&gt;
&lt;/ACCTINFOTRNRQ&gt;</font><font
SIZE="2">And a response for a
user with access to one account, supporting banking:
<a
NAME="_Toc379956901"><font SIZE="1">&lt;ACCTINFOTRNRS&gt;
	&lt;TRNUID&gt;12345
	&lt;STATUS&gt;
		&lt;CODE&gt;0
		&lt;SEVERITY&gt;INFO
	&lt;/STATUS&gt;
	&lt;ACCTINFORS&gt;
		&lt;DTACCTUP&gt;19960102
		&lt;ACCTINFO&gt;
		&lt;DESC&gt;Power Checking
		&lt;PHONE&gt;8002223333
		&lt;LOGO&gt;https://www.fi.com/ofx/logos/powercheck.jpg
			&lt;BANKACCTINFO&gt;
				&lt;BANKACCTFROM&gt;
					&lt;BANKID&gt;1234567789
					&lt;ACCTID&gt;12345
					&lt;ACCTTYPE&gt;CHECKING
				&lt;/BANKACCTFROM&gt;
			&lt;SUPTXDL&gt;Y
			&lt;XFERSRC&gt;Y
			&lt;XFERDEST&gt;Y
			&lt;SVCSTATUS&gt;ACTIVE
			&lt;/BANKACCTINFO&gt;	
		&lt;/ACCTINFO&gt;
	&lt;/ACCTINFORS&gt;
&lt;/ACCTINFOTRNRS&gt;</font></a></font>
</pre>

<ol>
  <li><a NAME="_Toc380493337"><font SIZE="5" FACE="Arial">Service Activation</font></a> </li>
</ol>

<p><font SIZE="2">Clients inform FIs that they wish to start, modify, or terminate a
service for an account by sending service activation requests. These are subject to data
synchronization, and servers should send responses to inform clients of any changes, even
if the changes originated on the server. </font></p>

<p><font SIZE="2">Clients use these records during the initial user sign-up process. Once
a client learns about the available accounts and services (by using the account
information request above, or by having a user directly enter the required information),
it sends a series of service ADD requests.</font> </p>

<p><font SIZE="2">If a user changes any of the identifying information about an account,
the client sends a service activation request containing both the old and the new account
information. Servers should interpret this as a change in the account, not a request to
transfer the service between two existing accounts, and all account-based information such
as synchronization tokens should continue. If a user or FI is reporting that service
should be moved between two existing accounts, service must be terminated for the old
account and started for the new account. The new account will have reset token histories,
as with any new service.</font> </p>

<p><font SIZE="2">Each service to be added, changed, or removed is contained in its own
request because the same real-world account might require different &lt;ACCTFROM&gt;
aggregates depending on the type of service.</font> 

<ol>
  <li><a NAME="_Toc380493338"><font SIZE="4" FACE="Arial">Activation Request and Response</font></a>
  </li>
  <li><font SIZE="2" FACE="Arial">Request &lt;ACCTRQ&gt;</font> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="162"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="336"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;ACCTRQ&gt;</font></b></td>
    <td WIDTH="336"><font SIZE="2">Account-service-request aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;<i>ACTION&gt;</i></font></b> </td>
    <td WIDTH="336"><font SIZE="2">Action aggregate, either &lt;SVCADD&gt;, &lt;SVCCHG&gt;, or
    &lt;SVCDEL&gt;</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/<i>ACTION&gt;</i></font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;SVC&gt;</font></b></td>
    <td WIDTH="336"><font SIZE="2">Service to be added/changed/deleted</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/ACCTRQ&gt;</font></b></td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><font SIZE="2" FACE="Arial">Response &lt;ACCTRS&gt;</font> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="162"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="336"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;ACCTRS&gt;</font></b></td>
    <td WIDTH="336"><font SIZE="2">Account-service-response aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;<i>ACTION&gt;</i></font></b> </td>
    <td WIDTH="336"><font SIZE="2">Action aggregate, either &lt;SVCADD&gt;, &lt;SVCCHG&gt;, or
    &lt;SVCDEL&gt;</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/<i>ACTION&gt;</i></font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;SVC&gt;</font></b></td>
    <td WIDTH="336"><font SIZE="2">Service to be added/changed:</font> <p><font SIZE="2">BANKSVC
    = Banking service<br>
    BPSVC = Payments service<br>
    INVSVC = Investments</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/ACCTRS&gt;</font></b></td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><font SIZE="2" FACE="Arial">Service Add Aggregate &lt;SVCADD&gt;</font> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="162"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="336"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;SVCADD&gt;</font></b></td>
    <td WIDTH="336"><font SIZE="2">Service-add aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;<i>ACCTTO&gt;</i></font></b> </td>
    <td WIDTH="336"><font SIZE="2">Service-specific-account-identification aggregate (see
    &lt;BANKACCTTO&gt;, &lt;INVACCTTO&gt;)</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/<i>ACCTTO</i>&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/SVCADD&gt;</font></b></td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><font SIZE="2" FACE="Arial">Service Change Aggregate &lt;SVCCHG&gt;</font> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="162"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="336"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;SVCCHG&gt;</font></b></td>
    <td WIDTH="336"><font SIZE="2">Service-add aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;<i>ACCTFROM&gt;</i></font></b> </td>
    <td WIDTH="336"><font SIZE="2">Service-specific-account-identification aggregate (see
    &lt;BANKACCTFROM&gt;, &lt;INVACCTFROM&gt;)</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/<i>ACCTFROM</i>&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;<i>ACCTTO&gt;</i></font></b> </td>
    <td WIDTH="336"><font SIZE="2">Service-specific-account-identification aggregate (see
    &lt;BANKACCTTO&gt;, &lt;INVACCTTO&gt;)</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/<i>ACCTTO</i>&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/SVCCHG&gt;</font></b></td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><font SIZE="2" FACE="Arial">Service Delete Aggregate &lt;SVCDEL&gt;</font> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="162"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="336"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;SVCDEL&gt;</font></b></td>
    <td WIDTH="336"><font SIZE="2">Service-deletion aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;<i>ACCTFROM&gt;</i></font></b> </td>
    <td WIDTH="336"><font SIZE="2">Service-specific-account-identification aggregate (see
    &lt;BANKACCTFROM&gt;, &lt;INVACCTFROM&gt;)</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/<i>ACCTFROM</i>&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/SVCDEL&gt;</font></b></td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc378489965"><font SIZE="2" FACE="Arial">Status Codes</font></a> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="72"><i><font SIZE="1">Code</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="300"><i><font SIZE="2">Meaning</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">0</font></td>
    <td WIDTH="300"><font SIZE="2">Success (INFO)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2000</font></td>
    <td WIDTH="300"><font SIZE="2">General error (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2002</font></td>
    <td WIDTH="300"><font SIZE="2">Other account error (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2006</font></td>
    <td WIDTH="300"><font SIZE="2">Source (from) account not found (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2007</font></td>
    <td WIDTH="300"><font SIZE="2">Source (from) account closed (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2008</font></td>
    <td WIDTH="300"><font SIZE="2">Source (from) account not authorized (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2009</font></td>
    <td WIDTH="300"><font SIZE="2">Destination (to) account not found (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2010</font></td>
    <td WIDTH="300"><font SIZE="2">Destination (to) account closed (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2011</font></td>
    <td WIDTH="300"><font SIZE="2">Destination (to) account not authorized (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">13502</font></td>
    <td WIDTH="300"><font SIZE="2">Invalid service (ERROR)</font> </td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493339"><font SIZE="4" FACE="Arial">Service Activation Synchronization</font></a>
  </li>
</ol>

<p><font SIZE="2">Service activation requests are subject to the standard data
synchronization protocol. The scope of these requests and the &lt;TOKEN&gt; is the
user-ID. The request and response tags are &lt;ACCTSYNCRQ&gt; and &lt;ACCTSYNCRS&gt;.</font>

<ol>
  <li><a NAME="_Toc380493340"><font SIZE="4" FACE="Arial">Examples</font></a><font SIZE="2">Activating
    a payment:</font> </li>
</ol>

<pre>
<font SIZE="1">&lt;ACCTTRNRQ&gt;
	&lt;TRNUID&gt;12345
	&lt;ACCTRQ&gt;
		&lt;SVCADD&gt;
			&lt;BANKACCTTO&gt;
				&lt;BANKID&gt;1234567789
				&lt;ACCTID&gt;12345
				&lt;ACCTTYPE&gt;CHECKING
			&lt;/BANKACCTTO&gt;	
		&lt;/SVCADD&gt;	
		&lt;SVC&gt;BPSVC
	&lt;/ACCTRQ&gt;	
&lt;/ACCTTRNRQ&gt;</font><font
SIZE="2">A response:
</font><font SIZE="1" FACE="Courier New">&lt;ACCTTRNRS&gt;
	&lt;TRNUID&gt;12345
		&lt;STATUS&gt;
		&lt;CODE&gt;0
		&lt;SEVERITY&gt;INFO
	&lt;/STATUS&gt;
	&lt;ACCTRS&gt;
		&lt;SVCADD&gt;
			&lt;BANKACCTTO&gt;
				&lt;BANKID&gt;1234567789
				&lt;ACCTID&gt;12345
				&lt;ACCTTYPE&gt;CHECKING
			&lt;/BANKACCTTO&gt;	
		&lt;/SVCADD&gt;	
		&lt;SVC&gt;BPSVC
	&lt;/ACCTRS&gt;	
&lt;/ACCTTRNRS&gt;</font>
</pre>

<ol>
  <li><a NAME="_Toc380493341"><font SIZE="5" FACE="Arial">Name and Address Changes
    &lt;CHGUSERINFORQ&gt; &lt;CHGUSERINFORS&gt;</font></a> </li>
</ol>

<p><font SIZE="2">Users may request that an FI update the official name, address, phone,
and e-mail information using the &lt;CHGUSERINFORQ&gt;. Only the fields that should be
changed are sent. The response reports all of the current values. For security reasons,
some of the fields in the &lt;ENROLLRQ&gt; cannot be changed online, such as tax ID. </font></p>

<p><font SIZE="2">The transaction tag is &lt;CHGUSERINFOTRNRQ&gt; and
&lt;CHGUSERINFOTRNRSRQ&gt;. These methods are subject to synchronization,
&lt;CHGUSERINFOSYNCRQ&gt; and &lt;CHGUSERINFOSYNCRS&gt;.</font> 

<ol>
  <li><a NAME="_Toc380493342"><font SIZE="4" FACE="Arial">&lt;CHGUSERINFORQ&gt;</font></a> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="180"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="318"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;CHGUSERINFORQ&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Change-user-information-request aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;FIRSTNAME&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">First name of user</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;MIDDLENAME&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Middle name of user</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;LASTNAME&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Last name of user</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;ADDR1&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Address line 1</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;ADDR2&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Address line 2</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;ADDR3&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Address line 3</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;CITY&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">City</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;STATE&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">State or province</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;POSTALCODE&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Postal code</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;COUNTRY&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">3-letter country code from ISO/DIS-3166</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;DAYPHONE&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Daytime telephone number</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;EVEPHONE&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Evening telephone number</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;EMAIL&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Electronic e-mail address</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;/CHGUSERINFORQ&gt;</font></b> </td>
    <td WIDTH="318">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493343"><font SIZE="4" FACE="Arial">&lt;CHGUSERINFORS&gt;</font></a> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="180"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="318"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;CHGUSERINFORS&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Change-user-information-request aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;FIRSTNAME&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">First name of user</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;MIDDLENAME&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Middle name of user</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;LASTNAME&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Last name of user</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;ADDR1&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Address line 1</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;ADDR2&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Address line 2</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;CITY&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">City</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;STATE&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">State or province</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;POSTALCODE&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Postal code</font></td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;COUNTRY&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">3-letter country code from ISO/DIS-3166</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;DAYPHONE&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Daytime telephone number</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;EVEPHONE&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Evening telephone number</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><font SIZE="1" FACE="Arial">&lt;EMAIL&gt;</font> </td>
    <td WIDTH="318"><font SIZE="2">Electronic e-mail address</font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;DTINFOCHG&gt;</font></b> </td>
    <td WIDTH="318"><font SIZE="2">Date and time of update <i>datetime</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="180"><b><font SIZE="1">&lt;/CHGUSERINFORS&gt;</font></b> </td>
    <td WIDTH="318">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493344"><font SIZE="4" FACE="Arial">Status Codes</font></a> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="72"><i><font SIZE="1">Code</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="300"><i><font SIZE="2">Meaning</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">0</font></td>
    <td WIDTH="300"><font SIZE="2">Success (INFO)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2000</font></td>
    <td WIDTH="300"><font SIZE="2">General error (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">13503</font></td>
    <td WIDTH="300"><font SIZE="2">Cannot change user information (ERROR)</font> </td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493345"><font SIZE="5" FACE="Arial">Signup Message Set Profile
    Information</font></a> </li>
</ol>

<p><font SIZE="2">A server must include the following aggregates as part of the profile
&lt;MSGSETLIST&gt; response, since every server must support at least the account
information and service activation messages. In the &lt;ENROLLPROF&gt; aggregate, servers
indicate how enrollment should proceed: via the client, a given web page, or a text
message directing users to some other method (such as a phone call)..</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="162"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="336"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;SIGNUPMSGSET&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Signup-message-set-profile-information aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;SIGNUPMSGSETV1&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Opening tag for V1 of the message set profile information</font>
    </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;MSGSETCORE&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Common message set information, defined in the profile
    chapter</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/MSGSETCORE&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162">&nbsp;</td>
    <td WIDTH="336"><font SIZE="2">Enrollment options - only one of &lt;CLIENTENROLL&gt;,
    &lt;WEBENROLL&gt;, or &lt;OTHERENROLL&gt; is allowed</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;</font></b><font SIZE="1" FACE="Arial">CLIENTENROLL<b>&gt;</b></font>
    </td>
    <td WIDTH="336"><font SIZE="2">Client-based enrollment supported</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;ACCTREQUIRED&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Y if account number is required as part of enrollment <i>Boolean</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/</font></b><font SIZE="1" FACE="Arial">CLIENTENROLL<b>&gt;</b></font>
    </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;</font></b><font SIZE="1" FACE="Arial">WEBENROLL<b>&gt;</b></font>
    </td>
    <td WIDTH="336"><font SIZE="2">Web-based enrollment supported</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;URL&gt;</font></b></td>
    <td WIDTH="336"><font SIZE="2">URL to start enrollment process</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/WEBENROLL&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;</font></b><font SIZE="1" FACE="Arial">OTHERENROLL<b>&gt;</b></font>
    </td>
    <td WIDTH="336"><font SIZE="2">Some other enrollment process</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;MESSAGE&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Message to give to consumer about what to do next (e.g. a
    phone number) <i>A-80</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/</font></b><font SIZE="1" FACE="Arial">OTHERENROLL<b>&gt;</b></font>
    </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;CHGUSERINFO&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Y if server supports client-based user information changes</font>
    </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;AVAILACCTS&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Y if server can provide information on accounts with
    SVCSTATUS available, N means client should expect to ask user for specific account
    information <i>Boolean</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/SIGNUPMSGSETV1&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/SIGNUPMSGSET&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
</table>

<p><br>

<ol>
  <li><a NAME="_Toc380493346"><font SIZE="6" FACE="Arial">Customer to FI Communication</font></a>
  </li>
  <li><a NAME="_Toc380493347"><font SIZE="5" FACE="Arial">The E-Mail Message Set</font></a> </li>
</ol>

<p><font SIZE="2">The e-mail message set includes two messages: generic e-mail and generic
MIME requests by way of URLs. In Open Financial Exchange files, the message set name is
EMAILMSGSV1.</font> 

<ol>
  <li><a NAME="_Toc380493348"><font SIZE="5" FACE="Arial">E-Mail Messages</font></a> </li>
</ol>

<p><font SIZE="2">Open Financial Exchange allows consumers and FIs to exchange messages.
The message body is in HTML so that FIs can provide some graphic structure to the message.
Keep in mind that, as with regular World Wide Web browsing, an Open Financial Exchange
client might not support some or all of the HTML formatting, so the text of the message
must be clear on its own. Clients can request that graphics (the images referenced in an
&lt;IMG&gt; tag) be sent as part of the response file, or clients can separately request
those elements. If a server sends images, it should use the standard procedure for
incorporating external data as described in Chapter 2. Servers are not required to support
HTML or to send images, even if the client asks.</font> </p>

<p><font SIZE="2">A user or an FI can originate a message. E-mail messages are subject to
data synchronization so that a server can send a response again if it is lost or if it is
used by multiple clients.</font> </p>

<p><font SIZE="2">Because e-mail messages cannot be replied to immediately, the response
should just echo back the original message (so that data synchronization will get this
original e-mail message to other clients). When the FI is ready to reply, it should
generate an unsolicited response (&lt;TRNUID&gt;0) and the client will pick this up during
synchronization.</font> </p>

<table BORDERCOLOR="#000000" BORDER="1">
  <tr>
    <td BGCOLOR="#FFFFFF" WIDTH="156"><i><font SIZE="1">Client Sends</font></i> </td>
    <td BGCOLOR="#FFFFFF" WIDTH="168"><i><font SIZE="2">Server Responds</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="156"><font SIZE="1">Account information</font></td>
    <td WIDTH="168">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="156"><font SIZE="1">From, To</font></td>
    <td WIDTH="168">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="156"><font SIZE="1">Subject</font></td>
    <td WIDTH="168">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="156"><font SIZE="1">Message</font></td>
    <td WIDTH="168">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="156">&nbsp;</td>
    <td WIDTH="168"><font SIZE="2">Account information</font> </td>
  </tr>
  <tr>
    <td WIDTH="156">&nbsp;</td>
    <td WIDTH="168"><font SIZE="2">From, To</font> </td>
  </tr>
  <tr>
    <td WIDTH="156">&nbsp;</td>
    <td WIDTH="168"><font SIZE="2">Subject</font> </td>
  </tr>
  <tr>
    <td WIDTH="156">&nbsp;</td>
    <td WIDTH="168"><font SIZE="2">Message</font> </td>
  </tr>
  <tr>
    <td WIDTH="156">&nbsp;</td>
    <td WIDTH="168"><font SIZE="2">Type</font> </td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493349"><font SIZE="4" FACE="Arial">Regular vs. Specialized E-Mail</font></a>
  </li>
</ol>

<p><font SIZE="2">Several services with Open Financial Exchange define e-mail requests and
responses that contain additional information specific to that service. To simplify
implementation for both clients and servers, this section defines a &lt;MAIL&gt; aggregate
that Open Financial Exchange uses in all e-mail requests and responses. For regular
e-mail, the only additional information is an account from aggregate and whether to
include images in the e-mail response or not. </font>

<ol>
  <li><a NAME="_Toc380493350"><font SIZE="4" FACE="Arial">Basic &lt;MAIL&gt; Aggregate</font></a>
  </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;MAIL&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Core e-mail aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;USERID&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">User ID such as SSN</font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;DTCREATED&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">When message was created <i>datetime</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;FROM&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Customer's input for whom message is from, <i>A-32</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;TO&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Who e-mail should be delivered to, <i>A-32</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;SUBJECT&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Subject of message (plain text, not HTML), <i>A-60</i></font>
    </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;MSGBODY&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Body of message, HTML-encoded or plain text depending on
    &lt;USEHTML&gt;, <i>A-10000</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/MSGBODY&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">End of message</font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;INCIMAGES&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Include images in response, <i>Boolean</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;USEHTML&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Y if client wants an HTML response, N if client wants plain
    text, <i>Boolean</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/MAIL&gt;</font></b></td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<p>If using HTML for the message body, clients and servers are <b>REQUIRED</b> to wrap the
desired HTML in an SGML marked section to protect the HTML markup: &lt;![ CDATA [ ... html
... ]]&gt;. See the example. 

<ol>
  <li><a NAME="_Toc380493351"><font SIZE="4" FACE="Arial">E-Mail &lt;MAILRQ&gt; &lt;MAILRS&gt;</font></a>
  </li>
</ol>

<p><font SIZE="2">E-mail is subject to synchronization. The transaction tag is
&lt;MAILTRNRQ&gt; / &lt;MAILTRNRS&gt; and the synchronization tag is &lt;MAILSYNCRQ&gt; /
&lt;MAILSYNCRS&gt;.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;MAILRQ&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">E-mail-message-request aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;MAIL&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Core e-mail aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/MAIL&gt;</font></b></td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/MAILRQ&gt;</font></b></td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<p>In a response, the &lt;TRNUID&gt; is zero if this is an unsolicited message. Otherwise,
it should contain the &lt;TRNUID&gt; of the user's original message. It is RECOMMENDED
that servers include the &lt;MESSAGE&gt; of the user's message as part of the reply
&lt;MESSAGE&gt;. The &lt;MESSAGE&gt; contents can include carriage returns to identify
desired line breaks. </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;MAILRS&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">E-mail-message-response aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;MAIL&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Core e-mail aggregate</font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/MAIL&gt;</font></b></td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/MAILRS&gt;</font></b></td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc378489974"><font SIZE="2" FACE="Arial">Status Codes</font></a> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="72"><i><font SIZE="1">Code</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="300"><i><font SIZE="2">Meaning</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">0</font></td>
    <td WIDTH="300"><font SIZE="2">Success (INFO)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2000</font></td>
    <td WIDTH="300"><font SIZE="2">General error (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">16500</font></td>
    <td WIDTH="300"><font SIZE="2">HTML not allowed (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">16501</font></td>
    <td WIDTH="300"><font SIZE="2">Unknown mail To: (ERROR)</font> </td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493352"><font SIZE="4" FACE="Arial">E-Mail Synchronization
    &lt;MAILSYNCRQ&gt; &lt;MAILSYNCRS&gt;</font></a> </li>
</ol>

<p><font SIZE="2">Open Financial Exchange uses data synchronization to collect responses
that could have been lost due to communication problems, or that the servers previously
sent to a different client or data file. All messages sent to the signed-on user ID are
covered by a single &lt;TOKEN&gt;. Note that this synchronization action expects only the
basic &lt;MAILRS&gt; responses. Specialized e-mail is received by means of their own
synchronization requests.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><font SIZE="1">Tag</font></td>
    <td BGCOLOR="#000000" WIDTH="366"><font SIZE="2">Description</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;MAILSYNCRQ&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">E-mail-synchronization-request aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;TOKEN&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Client history marker</font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;INCIMAGES&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Include images in response, <i>Boolean</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;USEHTML&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Y if client wants an HTML response, N if client wants plain
    text, <i>Boolean</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/MAILSYNCRQ&gt;</font></b> </td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><font SIZE="1">Tag</font></td>
    <td BGCOLOR="#000000" WIDTH="366"><font SIZE="2">Description</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;MAILSYNCRS&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">E-mail-synchronization-response. aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;TOKEN&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">Server history marker</font></td>
  </tr>
  <tr>
    <td WIDTH="132"><font SIZE="1">&lt;MAILTRNRS&gt;</font></td>
    <td WIDTH="366"><font SIZE="2">Missing e-mail response transactions (0 or more)</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/MAILSYNCRS&gt;</font></b> </td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493353"><font SIZE="4" FACE="Arial">Example</font></a> </li>
</ol>

<p><font SIZE="2">In this example, a consumer requests information from customer service
about the checking statement just downloaded. This example omits the &lt;OFX&gt; top level
and the signon &lt;SONRQ&gt;. This example uses HTML for the message body, and so it must
protect the HTML content in an SGML CDATA marked section.The request:</font> </p>

<pre>
<font SIZE="1">&lt;MAILTRNRQ&gt;
	&lt;TRNUID&gt;54321
	&lt;MAILRQ&gt;
		&lt;MAIL&gt;
			&lt;USERID&gt;123456789
			&lt;FROM&gt;James Hackleman
			&lt;TO&gt;Noelani Federal Savings
			&lt;SUBJECT&gt;What do I need to earn interest?
			&lt;DTCREATED&gt;19960305
</font><font
SIZE="2">			&lt;MSGBODY&gt;&lt;![ CDATA [&lt;HTML&gt;&lt;BODY&gt;I didn't earn any interest this month. Can you please tell me what I need to do to earn interest on this account?&lt;/BODY&gt;&lt;/HTML&gt;
]]&gt;&lt;/MSGBODY&gt;
			&lt;INCIMAGES&gt;N
			&lt;USEHTML&gt;Y
		&lt;/MAIL&gt;
	&lt;/MAILRQ&gt;
&lt;/MAILTRNRQ&gt;The response from the FI:
</font><font
SIZE="1" FACE="Courier New">&lt;MAILTRNRS&gt;
	&lt;TRNUID&gt;54321
	&lt;STATUS&gt;
		&lt;CODE&gt;0
		&lt;SEVERITY&gt;INFO
		&lt;/STATUS&gt;
	&lt;MAILRS&gt;
		&lt;MAIL&gt;
			&lt;USERID&gt;123456789
			&lt;DTCREATED&gt;19960307
			&lt;FROM&gt;Noelani Federal Savings
			&lt;TO&gt;James Hackleman
			&lt;SUBJECT&gt;Re: What do I need to earn interest?
</font><font
SIZE="2">			&lt;MSGBODY&gt;&gt;&lt;![ CDATA [&lt;HTML&gt;&lt;BODY&gt;You need to maintain $1000 in this account to earn interest. Because your balance was only $750 this month, no interest was earned. You could also switch to our new Checking Extra plan that always pays interest. Call us or check our web page http://www.fi.com/check-plans.html for more information.
Sincerely,
Customer Service Department

Original message:
I didn't earn any interest this month. Can you please tell me what I need to do to earn interest on this account?&lt;/BODY&gt;&lt;/HTML&gt;
]]&gt;&lt;/MSGBODY&gt;
			&lt;INCIMAGES&gt;N
			&lt;USEHTML&gt;Y
		&lt;/MAIL&gt;
	&lt;/MAILRS&gt;
&lt;/MAILTRNRS&gt;</font>
</pre>

<ol>
  <li><font SIZE="2" FACE="Arial">Example of Synchronization Involving E-Mail </font></li>
</ol>

<p><font SIZE="2">In the following example the client did not receive the reply to the
message sent in the previous example, so its &lt;TOKEN&gt; is one less than the server's.
The server replies by giving the current &lt;TOKEN&gt; and the missed response.</font> </p>

<pre>
<font SIZE="1">&lt;MAILSYNCRQ&gt;
	&lt;TOKEN&gt;101
&lt;/MAILSYNCRQ&gt;

&lt;MAILSYNCRS&gt;
	&lt;TOKEN&gt;102
	&lt;MAILTRNRS&gt;
		&lt;TRNUID&gt;54321
		&lt;STATUS&gt;
			&lt;CODE&gt;0
			&lt;SEVERITY&gt;INFO
		&lt;/STATUS&gt;
		&lt;MAILRS&gt;
			... contents of e-mail message response as shown in previous example
		&lt;/MAILRS&gt;
	&lt;/MAILTRNRS&gt;
&lt;/MAILSYNCRS&gt;</font>
</pre>

<ol>
  <li><a NAME="_Toc380493354"><font SIZE="5" FACE="Arial">Get HTML Page</font></a> </li>
</ol>

<p><font SIZE="2">Some responses contain values that are URLs, intended to be separately
fetched by clients if desired. Clients can use their own HTTP libraries to perform this
fetch outside of the Open Financial Exchange specification. However, to insulate clients
against changes in transport technology, and to allow for fetches that require the
protection of an authenticated signon by a specific user, Open Financial Exchange defines
a transaction roughly equivalent to an HTTP Get. Any MIME type can be retrieved, including
images as well as HTML pages.</font> 

<ol>
  <li><a NAME="_Toc380493355"><font SIZE="4" FACE="Arial">MIME Get Request and Response
    &lt;GETMIMERQ&gt; &lt;GETMIMERS&gt;</font></a> </li>
</ol>

<p><font SIZE="2">The following table lists the components of a request:</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;GETMIMERQ&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Get-MIME-request aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;URL&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">URL, <i>URL</i></font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/GETMIMERQ&gt;</font></b> </td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<p>The response simply echoes back the URL. The actual response, whether HTML, an image,
or some other type, is always sent as a separate part of the file using multi-part MIME. </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="132"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="366"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;GETMIMERS&gt;</font></b> </td>
    <td WIDTH="366"><font SIZE="2">Get-MIME-response aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;URL&gt;</font></b></td>
    <td WIDTH="366"><font SIZE="2">URL, <i>URL</i></font></td>
  </tr>
  <tr>
    <td WIDTH="132"><b><font SIZE="1">&lt;/GETMIMERS&gt;</font></b> </td>
    <td WIDTH="366">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc378489978"><font SIZE="2" FACE="Arial">Status Codes</font></a> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="72"><i><font SIZE="1">Code</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="300"><i><font SIZE="2">Meaning</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">0</font></td>
    <td WIDTH="300"><font SIZE="2">Success (INFO)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2000</font></td>
    <td WIDTH="300"><font SIZE="2">General error (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">2019</font></td>
    <td WIDTH="300"><font SIZE="2">Duplicate transaction (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">16502</font></td>
    <td WIDTH="300"><font SIZE="2">Invalid URL (ERROR)</font> </td>
  </tr>
  <tr>
    <td WIDTH="72"><font SIZE="1">16503</font></td>
    <td WIDTH="300"><font SIZE="2">Unable to get URL (ERROR)</font> </td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493356"><font SIZE="4" FACE="Arial">Example</font></a><font SIZE="2">A
    request:</font> </li>
</ol>

<pre>
<font SIZE="1">&lt;GETMIMETRNRQ&gt;
	&lt;TRNUID&gt;54321
	&lt;GETMIMERQ&gt;
		&lt;URL&gt;http://www.fi.com/apage.html
	&lt;/GETMIMERQ&gt;
&lt;/GETMIMETRNRQ&gt;</font><font
SIZE="2">A response - the full
file is shown here to illustrate the use of multi-part MIME:
</font><font
SIZE="1" FACE="Courier New">HTTP 1.0 200 OK
Content-Type: multipart/x-mixed-replace; boundary =--boundary-

--boundary--
Content-Type: application/x-ofx
Content-Length: 8732

</font><font
SIZE="2">OFXHEADER:100
DATA:OFXSGML
VERSION:100
ENCRYPTION:1
ENCODING:USASCII

&lt;OFX&gt;
		&lt;!-- signon not shown 
		message set wrappers not shown --&gt;
&lt;GETMIMETRNRS&gt;
	&lt;TRNUID&gt;54321
	&lt;STATUS&gt;
		&lt;CODE&gt;0
		&lt;SEVERITY&gt;INFO
	&lt;/STATUS&gt;
	&lt;GETMIMERS&gt;
		&lt;URL&gt;http://www.fi.com/apage.html
	&lt;/GETMIMERS&gt;
&lt;/GETMIMETRNRS&gt;
&lt;/OFX&gt;

--boundary-- 
Content-Type: text/html
&lt;HTML&gt;
	&lt;!-- standard HTML page --&gt;
&lt;/HTML&gt;

--boundary--
	
</font>
</pre>

<ol>
  <li><a NAME="_Toc380493357"><font SIZE="5" FACE="Arial">E-Mail Message Set Profile
    Information</font></a> </li>
</ol>

<p><font SIZE="2">If either or both of the messages in the e-mail message set are
supported, the following aggregate must be included in the profile &lt;MSGSETLIST&gt;
response.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="162"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="336"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;EMAILMSGSET&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">E-mail-message-set-profile-information aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;EMAILMSGSETV1&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Opening tag for V1 of the message set profile information</font>
    </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;MSGSETCORE&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Common message set information, defined in the profile
    chapter</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/MSGSETCORE&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;EMAIL&gt;</font></b></td>
    <td WIDTH="336"><font SIZE="2">Y if server supports generic e-mail message</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;GETMIME&gt;</font></b> </td>
    <td WIDTH="336"><font SIZE="2">Y if server supports get MIME message</font> </td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/EMAILMSGSETV1&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
  <tr>
    <td WIDTH="162"><b><font SIZE="1">&lt;/EMAILMSGSET&gt;</font></b> </td>
    <td WIDTH="336">&nbsp;</td>
  </tr>
</table>

<p><br>
<br>

<ol>
  <li><a NAME="_Toc380493358"><font SIZE="6" FACE="Arial">Recurring Transactions</font></a> </li>
</ol>

<p><font SIZE="2">Open Financial Exchange enables users to automate transactions that
occur on a regular basis. Recurring transactions are useful when a customer has payments
or transfers, for example, that repeat at regular intervals. The customer can create a
&quot;model&quot; at the server for automatic generation of these instructions. The model
in turn creates payments or transfers until it is canceled or expires. After the user
creates a recurring model at the server, the server can relieve the user from the burden
of creating these transactions; it generates the transactions on its own, based on the
operating parameters of the model.</font> 

<ol>
  <li><a NAME="_Toc380493359"><font SIZE="5" FACE="Arial">Creating a Recurring Model</font></a>
  </li>
</ol>

<p><font SIZE="2">The client must provide the following information to create a model:</font>

<ul>
  <li><font SIZE="2">Type of transaction generated by the model (payment or transfer) </font></li>
  <li><font SIZE="2">Frequency of recurring transaction</font> </li>
  <li><font SIZE="2">Total number of recurring transactions to generate</font> </li>
  <li><font SIZE="2">Service-specific information, such as transfer date, payment amount,
    payee address</font> </li>
</ul>

<p><font SIZE="2">The model creates each transaction some time before its due date,
usually thirty days. This allows the user to retrieve the transactions in advance of
posting. This also gives the user the opportunity to modify or cancel individual
transactions without changing the recurring model itself.</font> </p>

<p><font SIZE="2">When a model is created, it can generate several transactions
immediately. The model does not automatically return responses for the newly created
transactions. It only returns a response to the request that was made to create the model.
For this reason, clients should send a synchronization request along with the request to
create a model. This allows the server to return the newly created transaction responses,
as well as the response to the request to set up a new model.</font> 

<ol>
  <li><a NAME="_Toc380493360"><font SIZE="5" FACE="Arial">Recurring Instructions
    &lt;RECURRINST&gt;</font></a> </li>
</ol>

<p><font SIZE="2">The Recurring Instructions aggregate is used to specify the schedule for
a repeating instruction. It is passed to the server when a recurring transfer or payment
model is first created.</font> </p>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="168"><i><font SIZE="1">Tag</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="330"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="168"><b><font SIZE="1">&lt;RECURRINST&gt;</font></b> </td>
    <td WIDTH="330"><font SIZE="2">Recurring-Instructions aggregate</font> </td>
  </tr>
  <tr>
    <td WIDTH="168"><b><font SIZE="1">&lt;FREQ&gt;</font></b></td>
    <td WIDTH="330"><font SIZE="2">Frequency, see section 10.2.1</font> </td>
  </tr>
  <tr>
    <td WIDTH="168"><font SIZE="1" FACE="Arial">&lt;NINSTS&gt;</font> </td>
    <td WIDTH="330"><font SIZE="2">Number of instructions</font> <p><font SIZE="2">If this tag
    is absent, the schedule is open-ended,<i> N-3</i></font> </td>
  </tr>
  <tr>
    <td WIDTH="168"><b><font SIZE="1">&lt;/RECURRINST&gt;</font></b> </td>
    <td WIDTH="330">&nbsp;</td>
  </tr>
</table>

<ol>
  <li><a NAME="_Toc380493361"><font SIZE="4" FACE="Arial">Values for &lt;FREQ&gt;</font></a> </li>
</ol>

<table BORDER="1">
  <tr>
    <td BGCOLOR="#000000" WIDTH="126"><i><font SIZE="2">Value</font></i> </td>
    <td BGCOLOR="#000000" WIDTH="180"><i><font SIZE="2">Description</font></i> </td>
  </tr>
  <tr>
    <td WIDTH="126"><font SIZE="1">WEEKLY</font></td>
    <td WIDTH="180"><font SIZE="2">Weekly</font> </td>
  </tr>
  <tr>
    <td WIDTH="126"><font SIZE="1">BIWEEKLY</font></td>
    <td WIDTH="180"><font SIZE="2">Biweekly</font> </td>
  </tr>
  <tr>
    <td WIDTH="126"><font SIZE="1">TWICEMONTHLY</font></td>
    <td WIDTH="180"><font SIZE="2">Twice a month</font> </td>
  </tr>
  <tr>
    <td WIDTH="126"><font SIZE="1">MONTHLY</font></td>
    <td WIDTH="180"><font SIZE="2">Monthly</font> </td>
  </tr>
  <tr>
    <td WIDTH="126"><font SIZE="1">FOURWEEKS</font></td>
    <td WIDTH="180"><font SIZE="2">Every four weeks</font> </td>
  </tr>
  <tr>
    <td WIDTH="126"><font SIZE="1">BIMONTHLY</font></td>
    <td WIDTH="180"><font SIZE="2">Bimonthly</font> </td>
  </tr>
  <tr>
    <td WIDTH="126"><font SIZE="1">QUARTERLY</font></td>
    <td WIDTH="180"><font SIZE="2">Quarterly</font> </td>
  </tr>
  <tr>
    <td WIDTH="126"><font SIZE="1">SEMIANNUALLY</font></td>
    <td WIDTH="180"><font SIZE="2">Semiannually</font> </td>
  </tr>
  <tr>
    <td WIDTH="126"><font SIZE="1">TRIANNUALLY</font></td>
    <td WIDTH="180"><font SIZE="2">Triannually</font> </td>
  </tr>
  <tr>
    <td WIDTH="126"><font SIZE="1">ANNUALLY</font></td>
    <td WIDTH="180"><font SIZE="2">Annually</font> </td>
  </tr>
</table>

<p>Rules for calculating recurring dates of WEEKLY, BIWEEKLY, and TWICEMONTHLY are as
follows: 

<ul>
  <li>WEEKLY = starting date for first transaction, starting date + 7 days for the second </li>
  <li>TWICEMONTHLY = starting date for first, starting date + 15 days for the second </li>
  <li>BIWEEKLY = starting date for first, starting date + 14 days for the second </li>
</ul>

<p><b>Examples:</b> </p>

<p>Start date of May 2: next transaction date for WEEKLY is May 9; TWICEMONTHLY is May 17;
next transfer date for BIWEEKLY is May 16. </p>

<p>Start date of May 20: next date for WEEKLY is May 27; TWICEMONTHLY is June 4; next date
for BIWEEKLY is June 3. </p>

<p>TWICEMONTHLY recurring transactions will occur each month on those days adjusting for
weekends and holidays. BIWEEKLY will occur every 14 days. 

<ol>
  <li><a NAME="_Toc380493362"><font SIZE="4" FACE="Arial">Examples</font></a> </li>
</ol>

<p><font SIZE="2">The following example illustrates the creation of a repeating payment.
The payment repeats on a monthly basis for 12 months. All payments are for $395.The
request:</font> </p>

<pre>
<font SIZE="1">.
.
.
&lt;RECPMTRQ&gt;
	&lt;RECURRINST&gt;
		&lt;FREQ&gt;MONTHLY
		&lt;NINSTS&gt;12
	&lt;/RECURRINST&gt;
	&lt;PMTINFO&gt;		
		&lt;BANKACCTFROM&gt;
			&lt;BANKID&gt;555432180
			&lt;ACCTID&gt;763984
			&lt;ACCTTYPE&gt;CHECKING
		&lt;/BANKACCTFROM&gt;
		&lt;TRNAMT&gt;395.00
		&lt;PAYEEID&gt;77810
		&lt;PAYACCT&gt;444-78-97572
		&lt;DTDUE&gt;19971115
		&lt;MEMO&gt;Auto loan payment
	&lt;/PMTINFO&gt;	
&lt;/RECPMTRQ&gt;
.
.
.

</font><font
SIZE="2">The response includes the &lt;RECSRVRTID&gt;
that the client can use 

to cancel or modify the model:
</font><font
SIZE="1" FACE="Courier New">.
.
.
&lt;RECPMTRS&gt;
</font><font SIZE="2">	&lt;RECSRVRTID&gt;387687138	
	&lt;RECURRINST&gt;
		&lt;FREQ&gt;MONTHLY
		&lt;NINSTS&gt;12
	&lt;/RECURRINST&gt;
	&lt;PMTINFO&gt;		
		&lt;BANKACCTFROM&gt;
			&lt;BANKID&gt;555432180
			&lt;ACCTID&gt;763984
			&lt;ACCTTYPE&gt;CHECKING
		&lt;/BANKACCTFROM&gt;
		&lt;TRNAMT&gt;395.00
		&lt;PAYEEID&gt;77810
		&lt;PAYACCT&gt;444-78-97572
		&lt;DTDUE&gt;19971115
		&lt;MEMO&gt;Auto loan payment
	&lt;/PMTINFO&gt;	
&lt;/RECPMTRS&gt;
.
.
.</font>
</pre>

<ol>
  <li><a NAME="_Toc380493363"><font SIZE="5" FACE="Arial">Retrieving Transactions Generated by
    a Recurring Model</font></a> </li>
</ol>

<p><font SIZE="2">Once created, a recurring model independently generates instructions.
Since the client has not directly generated these transactions, the client has no record
of their creation. To enable users to modify and/or cancel pending instructions, the
client must use data synchronization in order to retrieve these transactions.</font> </p>

<p><font SIZE="2">The client has two purposes for synchronizing state with the server with
respect to recurring models:</font> 

<ul>
  <li><font SIZE="2">Retrieve any added, modified, or canceled recurring models</font> </li>
  <li><font SIZE="2">Retrieve any added, modified, or canceled transactions generated by any
    models</font> </li>
</ul>

<p><font SIZE="2">The client must be able to synchronize with the state of any models at
the server, as well as the state of any transactions generated by the server.</font> 

<ol>
  <li><a NAME="_Toc380493364"><font SIZE="5" FACE="Arial">Modifying and Canceling Individual
    Transactions</font></a> </li>
</ol>

<p><font SIZE="2">Once created and retrieved by the customer, recurring payments and
transfers are almost identical to customer-created payments or transfers. As with ordinary
payments or transfers, you can cancel or modify transactions individually. However,
because servers generate these transfers, they are different in the following respects:</font>

<ul>
  <li><font SIZE="2">Recurring transactions must be retrieved as part of a synchronization
    request.</font> </li>
  <li><font SIZE="2">Recurring transactions are related to a model. A server can modify or
    cancel transactions if the model is modified or canceled. </font></li>
</ul>

<ol>
  <li><font SIZE="5" FACE="Arial"><a NAME="_Toc380493365">Modifying and Canceling Recurring
    Model</a>s</font> </li>
</ol>

<p><font SIZE="2">A recurring model can be modified or canceled. When a model is modified,
all transactions that it generates in the future will change as well. The client can
indicate whether transactions that have been generated, but have not been sent, should be
modified as well. The actual elements within a transaction that can be modified differ by
service. See the recurring sections within the Banking and Payments chapters for details.</font>
</p>

<p><font SIZE="2">A user can cancel a model immediately or at a future date. If a user
cancels the model immediately, the client cancels any transactions that it has not yet
sent. If the client schedules the cancel for a future date, the client will not cancel
pending transactions.</font> 

<ol>
  <li><a NAME="_Toc380493366"><font SIZE="4" FACE="Arial">Examples</font></a> </li>
</ol>

<p><font SIZE="2">Canceling a recurring payment model requires the client to pass the
&lt;RECSRVRTID&gt; of the model. The client requests that pending payments also be
canceled. The server cancels the model immediately and notifies the client that both the
model and any scheduled payments were canceled.The request:</font> </p>

<pre>
<font SIZE="1">.
.
.
	&lt;RECPMTCANCRQ&gt;
		&lt;RECSRVRTID&gt;387687138
		&lt;CANPENDING&gt;Y
	&lt;/RECPMTCANCRQ&gt;
.
.
.
</font><font
SIZE="2">The response:
</font><font SIZE="1" FACE="Courier New">.
.
.
	&lt;RECPMTCANCRS&gt;
		&lt;RECSRVRTID&gt;387687138
		&lt;CANPENDING&gt;Y
	&lt;/RECPMTCANCRS&gt;
.
.
.
</font>
</pre>

<pre><img src="" width="382" height="208" alt=" (7739 bytes)">
stadyn_image9</pre>

<p><font SIZE="2">The server also cancels any payments that have been generated but not
executed. In the example shown above, the client would not learn of this immediately. To
receive notification that the model and all generated payments were canceled, the client
would need to include a synchronization request in the file. The following example
illustrates this alternate approach.The request file now includes a synchronization
request:</font> </p>

<pre>
<font SIZE="1">.
.
.
	&lt;RECPMTCANCRQ&gt;
		&lt;RECSRVRTID&gt;387687138
		&lt;CANPENDING&gt;Y
	&lt;/RECPMTCANCRQ&gt;
	&lt;PMTSYNCRQ&gt;
		&lt;TOKEN&gt;12345
		&lt;BANKACCTFROM&gt;
			&lt;BANKID&gt;123432123
			&lt;ACCTID&gt;516273
			&lt;ACCTTYPE&gt;CHECKING
		&lt;/BANKACCTFROM&gt;
	&lt;/PMTSYNCRQ&gt;
.
.
.
</font><font
SIZE="2">The response file now contains two responses
(assuming one payment was pending), 

one for the canceled model and one for the canceled payment.
</font><font
SIZE="1" FACE="Courier New">.
.
.
	&lt;RECPMTCANCRS&gt;
		&lt;RECSRVRTID&gt;387687138
		&lt;CANPENDING&gt;Y
	&lt;/RECPMTCANCRS&gt;
	&lt;PMTSYNCRS&gt;	
		&lt;TOKEN&gt;3247989384
		&lt;BANKACCTFROM&gt;
			&lt;BANKID&gt;123432123
			&lt;ACCTID&gt;516273
			&lt;ACCTTYPE&gt;CHECKING
		&lt;/BANKACCTFROM&gt;
		&lt;PMTTRNRS&gt;
			&lt;TRNUID&gt;10103
			&lt;STATUS&gt;
				&lt;CODE&gt;0
				&lt;SEVERITY&gt;INFO
			&lt;/STATUS&gt;
			&lt;PMTCANCRS&gt;
				&lt;SRVRTID&gt;1030155
			&lt;/PMTCANCRS&gt;
		&lt;/PMTTRNRS&gt;
	&lt;/PMTSYNCRS&gt;
.
.
.

</font>
</pre>

<p><img src="" width="174" height="310" alt=" (4217 bytes)"><br>
stadyn_image10</p>
<script>mySlowFunction(5);</script>
<script>window.performance.mark('body_end');</script>
</body>`;

router.get('/with', (req, res) => {
    // var startHtml = fs.readFileSync(require.resolve('./flush/start.html'));
    // var endHtml = fs.readFileSync(require.resolve('./flush/end.html'));

    res.writeHead(200, {'Content-Type': 'text/html'});
    // send the head
    res.write(startHtml);
    // send the end
    res.write(endHtml);
    // complete
    res.end();
});

router.get('/with-padded', (req, res) => {
  // var startHtml = fs.readFileSync(require.resolve('./flush/start.html'));
  // var endHtml = fs.readFileSync(require.resolve('./flush/end.html'));

  res.writeHead(200, {'Content-Type': 'text/html'});
  // send the head
  res.write(startHtml);
  // pad out the buffer to clear it
  var str = '';
  for (var i = 0; i < 2000; i++){
    str += ' ';
  }
  res.write(str);
  // send the end
  res.write(endHtml);
  // complete
  res.end();
});

router.get('/without', (req, res) => {
    // var startHtml = fs.readFileSync(require.resolve('./flush/start.html'));
    // var endHtml = fs.readFileSync(require.resolve('./flush/end.html'));

    res.writeHead(200, {'Content-Type': 'text/html'});
    // send both start and end in 1 chunk
    res.write(startHtml + endHtml);
    // complete
    res.end();
});

app.use('/.netlify/functions/flush', router);

module.exports.handler = serverless(app);