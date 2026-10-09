import assert from "node:assert/strict";
import { test } from "node:test";
import { promises as fs } from "node:fs";
import { PassThrough } from "node:stream";
import path from "node:path";
import { videoCacheKey, videoFilePath, isVideoCached, serveLocalVideoFile } from "../packages/backend/src/media/videocache.ts";

test("videocache key and file path generation", () => {
  const url = "https://video.twimg.com/amplify_video/12345/vid/avc1/720x1280/test.mp4";
  const key = videoCacheKey(url);
  assert.equal(typeof key, "string");
  assert.equal(key.length, 32);

  const filePath = videoFilePath(url);
  assert.ok(filePath.endsWith(`${key}.mp4`));
});

test("serveLocalVideoFile handles full and 206 range requests", async () => {
  // Create a dummy video file in temp
  const tmpFile = path.join(process.cwd(), ".data", "videocache", "test-video.mp4");
  await fs.mkdir(path.dirname(tmpFile), { recursive: true });
  const dummyData = Buffer.alloc(10000, 42); // 10000 bytes
  await fs.writeFile(tmpFile, dummyData);

  // 1. Full 200 request test
  const stream1 = new PassThrough();
  let writtenStatus = 0;
  let writtenHeaders: any = {};
  (stream1 as any).writeHead = (status: number, headers: any) => {
    writtenStatus = status;
    writtenHeaders = headers;
  };
  const mockReplyFull: any = {
    hijack: () => {},
    raw: stream1,
  };
  const mockReqFull: any = {
    headers: {},
    method: "GET",
    raw: new PassThrough(),
  };

  await serveLocalVideoFile(tmpFile, mockReqFull, mockReplyFull);
  assert.equal(writtenStatus, 200);
  assert.equal(writtenHeaders["Content-Length"], 10000);
  assert.equal(writtenHeaders["Accept-Ranges"], "bytes");
  assert.equal(writtenHeaders["Content-Type"], "video/mp4");

  // 2. HTTP 206 Partial Content (Range: bytes=0-499) test
  const stream2 = new PassThrough();
  let rangeStatus = 0;
  let rangeHeaders: any = {};
  (stream2 as any).writeHead = (status: number, headers: any) => {
    rangeStatus = status;
    rangeHeaders = headers;
  };
  const mockReplyRange: any = {
    hijack: () => {},
    raw: stream2,
  };
  const mockReqRange: any = {
    headers: { range: "bytes=0-499" },
    method: "GET",
    raw: new PassThrough(),
  };

  await serveLocalVideoFile(tmpFile, mockReqRange, mockReplyRange);
  assert.equal(rangeStatus, 206);
  assert.equal(rangeHeaders["Content-Range"], "bytes 0-499/10000");
  assert.equal(rangeHeaders["Content-Length"], 500);
  assert.equal(rangeHeaders["Accept-Ranges"], "bytes");

  // Cleanup
  await fs.unlink(tmpFile).catch(() => {});
});
